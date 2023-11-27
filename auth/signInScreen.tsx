// ui imports
import Frame from "../component/view";
import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import form from "../Styles/forms";

// functional imports
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SignInFunction } from "../function/signin";

// Navigation imports
import { NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/root";

type SignInScreenNavigationProp = NavigationProp<AuthStackParamList, "SignIn">;

type Props = {
  navigation: SignInScreenNavigationProp;
};

type FormValues = {
  email: string;
  password: string;
};

const SignInScreen = ({ navigation }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  function getErrorMessage(code: string) {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already in use by another account.";
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
    SignInFunction({ email: data.email, password: data.password }).catch(
      (error) => {
        const message = getErrorMessage(error.code);
        setSnackbarMessage(message);
        setVisible(true);
      }
    );
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <Frame title={"Sign In"} keyboardAvoiding back>
      <View style={form.content}>
        <Text variant="displayLarge" style={form.heading}>
          Welcome Back
        </Text>
        <Text style={form.caption}>Glad To See you!</Text>
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

        <View style={form.forgotPasswordContainer}>
          <Text style={form.forgotPasswordText} onPress={handleForgotPassword}>
            Forgot Password?
          </Text>
        </View>

        <Button
          labelStyle={form.signInButton}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        >
          Sign In
        </Button>
        <View style={form.signUpContainer}>
          <Text style={form.signUpText}>Don't have an account?</Text>
          <Button mode="text" onPress={() => navigation.navigate("SignUp")}>
            Sign Up
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

export default SignInScreen;
