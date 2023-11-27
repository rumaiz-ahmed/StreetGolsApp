import { StyleSheet } from "react-native";

const form = StyleSheet.create({
  Center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  container: {
    width: "80%",
    alignItems: "flex-start",
    justifyContent: "center",
    flexGrow: 1,
  },
  heading: {
    fontSize: 32,
    marginBottom: 16,
    textAlign: "left",
  },
  caption: {
    fontSize: 16,
    marginBottom: 16,
    color: "#888",
    textAlign: "left",
  },
  inputField: {
    marginBottom: 16,
    width: "100%",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  buttonContainer: {
    alignItems: "center",
  },
  resetButton: {
    marginBottom: 8,
    padding: 5,
  },
  content: {
    width: "90%",
  },

  signUpButton: {
    marginBottom: 8,
    padding: 5,
  },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "center",
  },
  signInText: {
    fontSize: 16,
  },

  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  signInButton: {
    marginBottom: 8,
    padding: 5,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: "#888",
    textDecorationLine: "underline",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "center",
  },
  signUpText: {
    fontSize: 16,
  },
});

export default form;
