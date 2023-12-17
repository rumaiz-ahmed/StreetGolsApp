// ui imports
import Frame from "../component/view";
import {
  StyleSheet,
  Image,
  View,
  Share,
  Linking,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  FAB,
  Headline,
  Portal,
  Snackbar,
  Subheading,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import form from "../Styles/forms";
import { Entypo } from "@expo/vector-icons";
import pitchInfo from "../Styles/pitchInfo";
import { Feather, FontAwesome } from "@expo/vector-icons";

// functional imports
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../function/data";
import { SignOut } from "../function/signout";
import { auth, db } from "../firebaseConfig";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
// Create a toggle function
import { deleteField } from "firebase/firestore";

// Navigation imports
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import { addFriend, removeFriend } from "../function/friend";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import DropDown from "react-native-paper-dropdown";

type EditAccountScreenNavigationProp = NavigationProp<
  AppStackParamList,
  "EditAccount"
>;

type Props = {
  navigation: EditAccountScreenNavigationProp;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const EditAccountScreen = ({ navigation }: Props) => {
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return "";
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "67c2210a-f038-4973-8a68-529d5a7fa0d3",
        })
      ).data;
      console.log(token);

      // Update the user document with the push token
      const userDoc = doc(db, "users", `${auth.currentUser?.uid}`);
      await updateDoc(userDoc, {
        expoPushToken: token,
      });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
    if (!isEnabled) {
      const token = await registerForPushNotificationsAsync();
      if (!token) {
        alert("Please enable notifications from your phone settings.");
      }
    } else {
      // User wants to disable notifications, remove the push token
      const userDoc = doc(db, "users", `${auth.currentUser?.uid}`);
      await updateDoc(userDoc, {
        expoPushToken: deleteField(),
      });
    }
  };

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDelete = async () => {
    const user = auth.currentUser;
    const uid = `${auth.currentUser?.uid}`;
    const userDoc = doc(db, "users", uid);
    try {
      await deleteDoc(userDoc);
      if (user) {
        await deleteUser(user);
      } else {
        console.error("No user is currently logged in.");
      }
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const reauthenticate = async () => {
    const user = auth.currentUser;
    if (user) {
      const credential = EmailAuthProvider.credential(email, password);

      try {
        await reauthenticateWithCredential(user, credential);
        // User re-authenticated.
        handleDelete(); // Call the delete function here
      } catch (e) {
        console.error("Error during re-authentication: ", e);
      }
    } else {
      console.error("No user is currently logged in.");
    }

    hideDialog();
  };

  const [matchType, setMatchType] = useState<string | null>(null);
  const [additionalNote, setAdditionalNote] = useState<string | "">("");
  const [visible, setVisible] = useState(false);

  const onSubmit = async () => {
    if (!matchType || !additionalNote) {
      // Fields are empty, show the Snackbar
      setSnackbarMessage("Fields cannot be left blank.");
      setSnackbarVisible(true);
    } else {
      try {
        const gameDoc = doc(db, "users", `${auth.currentUser?.uid}`);
        await updateDoc(gameDoc, {
          position: matchType,
          bio: additionalNote,
        });

        navigation.navigate("Confirm", { message: "Updated Profile" });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const [Authvisible, setAuthVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showDialog = () => setAuthVisible(true);
  const hideDialog = () => setAuthVisible(false);

  return (
    <Frame back centered={false}>
      <View style={styles.container}>
        <Portal>
          <Dialog visible={Authvisible} onDismiss={hideDialog}>
            <Dialog.Title>Re-authenticate</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={reauthenticate}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable Push Notifications</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <Divider style={styles.divider} />
        <View
          style={{
            width: "90%",
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: 16,
          }}
        >
          <DropDown
            dropDownStyle={{ width: "90%" }}
            label="Position"
            value={matchType}
            activeColor="yellow"
            dropDownItemTextStyle={{
              color: "white",
            }}
            setValue={setMatchType}
            list={[
              { label: "Forward", value: "Forward" },
              { label: "Midfielder", value: "Midfielder" },
              { label: "Defender", value: "Defender" },
              { label: "GoalKeeper", value: "GoalKeeper" },
            ]}
            visible={visible}
            showDropDown={() => setVisible(true)}
            onDismiss={() => setVisible(false)}
          />
        </View>

        <TextInput
          style={{ width: "90%", alignSelf: "center", marginBottom: 16 }}
          placeholder="Bio"
          value={additionalNote}
          onChangeText={(text) => setAdditionalNote(text)}
          inputMode="text"
        />

        <Button
          mode={"contained"}
          onPress={() => onSubmit()}
          style={{ marginHorizontal: 10 }}
        >
          Edit Profile
        </Button>

        <Divider style={styles.divider} />
        <View style={styles.dangerZone}>
          <Button
            style={styles.dangerButton}
            mode="contained"
            labelStyle={{ color: "white", fontSize: 18 }}
            onPress={showDialog} // Call showDialog here
          >
            Delete Account
          </Button>
        </View>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
    backgroundColor: "#FF5733",
    color: "white",
    marginTop: 12, // Increased margin
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: "#fff",
  },
});

export default EditAccountScreen;
