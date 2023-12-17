// ui imports
import Frame from "../component/view";
import { View, Platform } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import form from "../Styles/forms";

// functional imports
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SignUpFunction } from "../function/signup";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Navigation imports
import { NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/root";

type SignUpScreenNavigationProp = NavigationProp<AuthStackParamList, "Welcome">;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpScreen = ({ navigation }: Props) => {
  const [expoPushToken, setExpoPushToken] = useState<string | "">();
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return "";
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId: '67c2210a-f038-4973-8a68-529d5a7fa0d3' })).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  useEffect(()=>{
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  },[])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  function getErrorMessage(code: string) {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Wrong password.";
      // Add more cases as needed for other error codes
      default:
        return "An error occurred. Please try again.";
    }
  }

  const onSubmit = (data: FormValues) => {
    try {
      if (data.password !== data.confirmPassword) {
        setPasswordMatchError(true);
        setSnackbarMessage("Passwords do not match.");
        setVisible(true);
        return;
      }

      const displayName = `${data.firstName} ${data.lastName}`;
      SignUpFunction({
        email: data.email,
        password: data.password,
        displayName,
        pushToken: expoPushToken,
      }).catch((error) => {
        const message = getErrorMessage(error.code);
        setSnackbarMessage(message);
        setVisible(true);
      });
    } catch (error) {}
  };

  return (
    <Frame title="Sign Up" keyboardAvoiding back>
      <View style={form.content}>
        <Text variant="displayLarge" style={form.heading}>
          Welcome Aboard
        </Text>
        <Text style={form.caption}>Create a new account</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={form.inputField}
              label="First Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="ascii-capable"
              error={errors.firstName ? true : false}
            />
          )}
          name="firstName"
          rules={{
            required: "First Name is required",
            pattern: /^[a-zA-Z0-9_]+$/,
          }}
          defaultValue=""
        />
        {errors.firstName && <Text>{errors.firstName.message}</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={form.inputField}
              label="Last Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="ascii-capable"
              error={errors.lastName ? true : false}
            />
          )}
          name="lastName"
          rules={{
            required: "Last Name is required",
            pattern: /^[a-zA-Z0-9_]+$/,
          }}
          defaultValue=""
        />
        {errors.lastName && <Text>{errors.lastName.message}</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={form.inputField}
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="email-address"
              error={errors.email ? true : false}
            />
          )}
          name="email"
          rules={{
            required: "Email is required",
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          }}
          defaultValue=""
        />
        {errors.email && (
          <Text>
            {errors.email.type === "required" && "This is required."}
            {errors.email.type === "pattern" && "Invalid Email"}
          </Text>
        )}
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={form.inputField}
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="ascii-capable"
              secureTextEntry={!isPasswordVisible}
              right={
                <TextInput.Icon
                  icon={isPasswordVisible ? "eye-off" : "eye"}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                />
              }
              error={errors.password ? true : false}
            />
          )}
          name="password"
          rules={{ required: "Password is required", minLength: 8 }}
          defaultValue=""
        />
        {errors.password && (
          <Text>
            {errors.password.type === "required" && "This is required."}
            {errors.password.type === "minLength" &&
              "Password must be at least 8 characters long."}
          </Text>
        )}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={form.inputField}
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="ascii-capable"
              secureTextEntry={!isConfirmPasswordVisible}
              right={
                <TextInput.Icon
                  icon={isConfirmPasswordVisible ? "eye-off" : "eye"}
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                />
              }
              error={errors.confirmPassword ? true : false}
            />
          )}
          name="confirmPassword"
          rules={{ required: "Password is required", minLength: 8 }}
          defaultValue=""
        />
        {errors.confirmPassword && (
          <Text>
            {errors.confirmPassword.type === "required" && "This is required."}
            {errors.confirmPassword.type === "minLength" &&
              "Password must be at least 8 characters long."}
            {passwordMatchError && "Passwords do not match."}
          </Text>
        )}

        <Button
          labelStyle={form.signUpButton}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        >
          Sign Up
        </Button>
        <View style={form.signInContainer}>
          <Text style={form.signInText}>Already have an account?</Text>
          <Button mode="text" onPress={() => navigation.navigate("SignIn")}>
            Sign In
          </Button>
        </View>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: "Close",
          onPress: () => {
            setVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </Frame>
  );
};

export default SignUpScreen;
