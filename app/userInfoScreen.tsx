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
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import { addFriend, removeFriend } from "../function/friend";

type UserInfoScreenNavigationProp = NavigationProp<
  AppStackParamList,
  "UserInfo"
>;

type Props = {
  navigation: UserInfoScreenNavigationProp;
  route: RouteProp<AppStackParamList, "UserInfo">;
};

const UserInfoScreen = ({ navigation, route }: Props) => {
  const { user, subscribeUser } = useStore();
  const { userId } = route.params;
  const currentUserId = auth.currentUser?.uid;

  // Check if the current user is a friend
  const initialIsFriend = currentUserId
    ? user?.friends.includes(currentUserId)
    : false;

  const [isFriend, setIsFriend] = useState(initialIsFriend); // Add this line

  useEffect(() => {
    subscribeUser(userId);
  }, [subscribeUser]);

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

  const handleFriendButtonPress = async () => {
    setIsFriend(!isFriend);

    if (!isFriend) {
      // Add the current user's ID to the user's friends list
      await addFriend(currentUserId, userId);
    } else {
      // Remove the current user's ID from the user's friends list
      await removeFriend(currentUserId, userId);
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
              uid: auth.currentUser?.uid,
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
              uid: auth.currentUser?.uid,
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
              uid: auth.currentUser?.uid,
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
