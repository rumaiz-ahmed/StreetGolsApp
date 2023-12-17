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
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  FAB,
  Headline,
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

// Navigation imports
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import { addFriend, removeFriend } from "../function/friend";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import DropDown from "react-native-paper-dropdown";

type ConfirmScreenNavigationProp = NavigationProp<AppStackParamList, "Confirm">;

type Props = {
  navigation: ConfirmScreenNavigationProp;
  route: RouteProp<AppStackParamList, "Confirm">;
};

const ConfirmScreen = ({ navigation, route }: Props) => {
  const { message } = route.params;

  return (
    <Frame>
      <View style={styles.successIcon}>
        {/* You can replace this with your own success icon */}
        <Text style={styles.icon}>✔️</Text>
      </View>
      <Title style={styles.successTitle}>Success</Title>
      <Text style={styles.successMessage}>
        {`You have successfully ${message}.`}
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Tab")}
        style={styles.button}
      >
        Back to Home
      </Button>
    </Frame>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successIcon: {
    backgroundColor: "yellow",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
    color: "white",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width: "100%",
  },
});

export default ConfirmScreen;
