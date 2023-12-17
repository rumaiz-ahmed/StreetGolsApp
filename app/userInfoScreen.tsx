// ui imports
import Frame from "../component/view";
import {
  StyleSheet,
  Image,
  View,
  Share,
  Linking,
  TouchableOpacity,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  FAB,
  Snackbar,
  Subheading,
  Text,
  Title,
} from "react-native-paper";
import form from "../Styles/forms";
import { Entypo } from "@expo/vector-icons";
import pitchInfo from "../Styles/pitchInfo";

// functional imports
import { useEffect, useState } from "react";
import { useStore } from "../function/data";
import { SignOut } from "../function/signout";
import { auth } from "../firebaseConfig";

// Navigation imports
import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import { addFriend, removeFriend } from "../function/friend";
import React from "react";

type UserInfoScreenNavigationProp = NavigationProp<
  AppStackParamList,
  "UserInfo"
>;

type Props = {
  navigation: UserInfoScreenNavigationProp;
  route: RouteProp<AppStackParamList, "UserInfo">;
};

const UserInfoScreen = ({ navigation, route }: Props) => {
  const { user, subscribeUser, users, fetchUsers } = useStore();
  const { userId } = route.params;
  const currentUserId = auth.currentUser?.uid;

 
  useFocusEffect(
    React.useCallback(() => {
      subscribeUser(userId);
      fetchUsers()
    }, [subscribeUser,fetchUsers])
  );

  const share = async () => {
    try {
      const url = `https://streetgols.com/userInfo/${route.params.userId}`;
      await Share.share({
        message: `Check out this player \n ${url}`,
      });
    } catch (error) {
      alert(error);
    }
  };

  // Find the current user and the user whose profile is being viewed
  const currentUser = users.find((user) => user.id === currentUserId);
  const profileUser = users.find((user) => user.id === userId);

  // Check if the profile user is a friend of the current user
  const isFriend = currentUser?.friends.includes(userId);

  const handleFriendButtonPress = async () => {
    if (isFriend) {
      // If the user is already a friend, remove them
      try {
        await removeFriend(currentUserId, userId);
        navigation.navigate("Confirm", { message: "Unfriended" });

      } catch (error) {
        alert(error);
      }
    } else {
      // If the user is not a friend, add them
      try {
        await addFriend(currentUserId, userId);
        const message = {
          to: user?.pushToken,
          sound: "default",
          title: "New Friend",
          body: `${currentUser?.displayName} has added you as a friend.`,
          data: { data: "goes here" },
        };

        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        }).then(()=>{

          navigation.navigate("Confirm", { message: "Added Friend" });
        })
      } catch (error) {
        alert( error);
      }
    }
  };
  
  return (
    <Frame
      back
      title={user?.displayName}
      rightIcon={() => <Entypo name="share" size={24} color="white" />}
      rightIconPress={share}
      centered={false}
    >
      <Avatar.Image
        source={require("../assets/icon.png")}
        size={100}
        style={styles.avatar}
      />

      <View style={styles.profileInfo}>
        <Title style={styles.displayName}>
          {user?.displayName || "User Name"}
        </Title>
        <Text style={styles.email}>{user?.email}</Text>
        <Button onPress={handleFriendButtonPress}>
      {isFriend ? "Unfriend" : "Add Friend"}
    </Button>
      </View>

      <Divider />

      <View style={styles.stats}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Details", {
              message: "Games Created",
              uid: userId,
            });
          }}
        >
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user?.gamesCreated || 0}</Text>
            <Text style={styles.statLabel}>Games Created</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Details", {
              message: "Games Played",
              uid:userId,
            });
          }}
        >
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user?.gamesPlayed || 0}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Details", {
              message: "Friends",
              uid: userId,
            });
          }}
        >
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user?.friends.length || 0}</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Divider />
      <View style={styles.bioSection}>
        <View style={styles.bioLabelContainer}>
          <Subheading style={styles.bioLabel}>Position</Subheading>
        </View>
        <Text style={styles.bioText}>{user?.position}</Text>
      </View>

      <View style={styles.bioSection}>
        <View style={styles.bioLabelContainer}>
          <Subheading style={styles.bioLabel}>Bio</Subheading>
        </View>
        <Text style={styles.bioText}>{user?.bio}</Text>
      </View>
      <Divider />
    </Frame>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  displayName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  bio: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bioLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bioLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginVertical: 10,
  },
  bioText: {
    fontSize: 16,
  },
});

export default UserInfoScreen;



