// ui imports
import Frame from "../component/view";
import { Button, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

// Navigation imports
import { NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "../navigation/root";

type WelcomeScreenNavigationProp = NavigationProp<
  AuthStackParamList,
  "Welcome"
>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const WelcomeScreen = ({ navigation }: Props) => {
  return (
    <Frame>
      <View style={[styles.welcomeContainer]}>
        <Text style={styles.welcomeText}>Welcome to StreetGols</Text>
        <Text style={styles.introText}>
          Join the ultimate street football community
        </Text>
      </View>
      <View style={[styles.buttonContainer]}>
        <Button
          labelStyle={styles.button}
          style={styles.spacing}
          mode="contained"
          onPress={() => navigation.navigate("SignUp")}
        >
          Sign Up
        </Button>
        <Button
          labelStyle={styles.button}
          style={styles.spacing}
          mode="outlined"
          onPress={() => navigation.navigate("SignIn")}
        >
          Sign In
        </Button>
      </View>
    </Frame>
  );
};

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "90%",
    position: "absolute",
    bottom: 90, // Adjust this value as needed
  },
  welcomeText: {
    fontSize: 32,
    marginBottom: 10,
    fontWeight: "bold",
  },
  introText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginVertical: 10,
    padding: 10,
  },
  spacing: {
    marginVertical: 10,
  },
});

export default WelcomeScreen;
