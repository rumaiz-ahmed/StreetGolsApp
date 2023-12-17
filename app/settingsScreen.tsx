import React from "react";
import { Text, View, StyleSheet, Linking } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import Frame from "../component/view";
import { Button, Divider, Headline } from "react-native-paper";
import { SignOut } from "../function/signout";

type SettingsScreenNavigationProp = NavigationProp<
  AppStackParamList,
  "Settings"
>;

type Props = {
  navigation: SettingsScreenNavigationProp;
};

const SettingsScreen = ({ navigation }: Props) => {
  return (
    <Frame back title="Settings" centered={false}>
<View style={styles.container}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate("EditAccount")}
        >
          Account
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() =>
            Linking.openURL("https://forms.gle/QtT7kFhYPFSqMPzQ9")
          }
        >
          Feedback
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => Linking.openURL("https://discord.gg/NUUK8BJbYy")}
        >
          Discord
        </Button>
        <Button
          mode="contained"
          style={styles.privacyButton}
          onPress={() =>
            Linking.openURL(
              "https://www.privacypolicies.com/live/8a0caa95-f23d-4b50-892b-3c56d1986c8d"
            )
          }
        >
          Privacy Policy
        </Button>
        <Divider style={styles.divider} />
        <View style={styles.dangerZone}>
          <Headline style={styles.dangerHeadline}>Danger Zone</Headline>
          <Text style={styles.dangerText}>Proceed with caution!</Text>
          <Button
            style={styles.dangerButton}
            mode="contained"
            onPress={() => SignOut()}
          >
            Sign Out
          </Button>
        </View>
      </View>
    </Frame>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Increased padding
  },
  button: {
    borderRadius: 5,
    marginBottom: 16, // Increased margin
  },
  privacyButton: {
    borderRadius: 5,
    marginBottom: 16, // Increased margin

  },
  divider: {
    marginTop: 16, // Increased margin
    marginBottom: 16, // Increased margin
  },
  dangerZone: {
    backgroundColor: "#FF5733",
    padding: 20, // Increased padding
    borderRadius: 5,
  },
  dangerHeadline: {
    color: "white",
    marginBottom: 12, // Increased margin
  },
  dangerText: {
    color: "white",
    marginBottom: 12, // Increased margin
  },
  dangerButton: {
    marginTop: 12, // Increased margin
  },
});


export default SettingsScreen;
