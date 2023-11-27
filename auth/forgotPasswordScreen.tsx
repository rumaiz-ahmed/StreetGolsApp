// ui imports
import Frame from "../component/view";
import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import form from "../Styles/forms";

// functional imports
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ForgotPasswordFunction } from "../function/forgotPassword";

// Navigation imports
import { NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/root";

type ForgotPasswordScreenNavigationProp = NavigationProp<
  AuthStackParamList,
  "SignIn"
>;

type Props = {
  navigation: ForgotPasswordScreenNavigationProp;
};
type FormValues = {
  email: string;
};

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const onSubmit = (data: FormValues) => {
    ForgotPasswordFunction({ email: data.email }).then(() => {
      setSnackbarMessage("Check your email!");
      setVisible(true);
    });
  };

  return (
    <Frame title="Forgot Password" back keyboardAvoiding>
      <View style={form.container}>
        <Text variant="displayLarge" style={form.heading}>
          No worries!
        </Text>
        <Text style={form.caption}>
          Enter your email address to reset your password
        </Text>
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
        <View style={form.buttonContainer}>
          <Button
            labelStyle={form.resetButton}
            mode="contained"
            onPress={handleSubmit(onSubmit)}
          >
            Reset Password
          </Button>
        </View>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: "OK",
          onPress: () => {
            setVisible(false);
            navigation.navigate("SignIn");
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </Frame>
  );
};

export default ForgotPasswordScreen;
