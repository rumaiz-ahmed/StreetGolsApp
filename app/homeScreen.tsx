// ui imports
import Frame from "../component/view";
import { StyleSheet } from "react-native";
import { Button, FAB, Snackbar, Text, TextInput } from "react-native-paper";
import form from "../Styles/forms";

// functional imports
import { useEffect, useState } from "react";
import { useStore } from "../function/data";
import { SignOut } from "../function/signout";
import { auth } from "../firebaseConfig";

// Navigation imports
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";

type HomeScreenNavigationProp = NavigationProp<AppStackParamList, "Tab">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
  const { user, subscribeUser, fetchUsers, users } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      subscribeUser(`${auth.currentUser?.uid}`);
      await fetchUsers();
    };

    fetchData();
  }, [subscribeUser, fetchUsers]);

  return (
    <Frame title={"Home"}>
      <Text onPress={() => SignOut()}>{user?.displayName}</Text>
      {users.map((user, index) => (
        <Text key={index}>{user.displayName}</Text>
      ))}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate("Pitches");
        }}
      />
    </Frame>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  card: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  dayHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
