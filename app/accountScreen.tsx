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
import { Feather, FontAwesome } from "@expo/vector-icons";

// functional imports
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../function/data";
import { SignOut } from "../function/signout";
import { auth } from "../firebaseConfig";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Navigation imports
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import { addFriend, removeFriend } from "../function/friend";

type AccountScreenNavigationProp = NavigationProp<AppStackParamList, "Tab">;

type Props = {
  navigation: AccountScreenNavigationProp;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const AccountScreen = ({ navigation }: Props) => {
  const [expoPushToken, setExpoPushToken] = useState<string | "">();
  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return "";
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId: '67c2210a-f038-4973-8a68-529d5a7fa0d3' })).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  
  const { user, subscribeUser, games, fetchGames } = useStore();
  const currentUserId = auth.currentUser?.uid;

  useFocusEffect(
    useCallback(() => {
      subscribeUser(`${auth.currentUser?.uid}`);
      fetchGames(); // Add this line if you have a function to fetch games
    }, [subscribeUser, fetchGames])
  );

  return (
    <Frame
      title={user?.displayName}
      rightIcon={() => <Feather name="settings" size={24} color="white" />}
      rightIconPress={() => navigation.navigate("Settings")}
      centered={false}
    >
      <Avatar.Image
        source={require("../assets/icon.png")}
        size={100}
        style={styles.avatar}
      />

      <View style={styles.profileInfo}>
        <Title style={styles.displayName}>{user?.displayName}</Title>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
      </View>

      <Divider />

      <View style={styles.stats}>
        <TouchableOpacity onPress={()=> {
          navigation.navigate("Details", {
            message: "Games Created",
            uid: auth.currentUser?.uid
          })
        }}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user?.gamesCreated || 0}</Text>
          <Text style={styles.statLabel}>Games Created</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {
          navigation.navigate("Details", {
            message: "Games Played", 
            uid: auth.currentUser?.uid
          })
        }}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user?.gamesPlayed || 0}</Text>
          <Text style={styles.statLabel}>Games Played</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {
          navigation.navigate("Details", {
            message: "Friends",
            uid: auth.currentUser?.uid
          })
        }}>
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
          <TouchableOpacity
            style={{ marginLeft: "80%" }}
            onPress={() => navigation.navigate("EditAccount")}
          >
            <FontAwesome name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.bioText}>{user?.position}</Text>
      </View>

      <View style={styles.bioSection}>
        <View style={styles.bioLabelContainer}>
          <Subheading style={styles.bioLabel}>Bio</Subheading>
          <TouchableOpacity
            style={{ marginLeft: "90%" }}
            onPress={() => navigation.navigate("EditAccount")}
          >
            <FontAwesome name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.bioText}>{user?.bio}</Text>
      </View>
      <Divider />

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Latest Games</Title>
          <ScrollView>
            {games
              .filter(
                (game) =>
                  game.creatorUserID === currentUserId ||
                  (currentUserId &&
                    game.players &&
                    game.players.includes(currentUserId))
              )

              .slice(0, 4)
              .map((game, index) => (
                <Card
                  style={styles.card}
                  key={index}
                  onPress={() =>
                    navigation.navigate("GameInfo", {
                      gameId: game.id,
                    })
                  }
                >
                  <View style={styles.cardContent}>
                    <Card.Cover
                      source={{ uri: game.imageURL }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>{game.date}</Text>
                      <Text>
                        {game.creatorUserID === currentUserId
                          ? "Owner"
                          : "Player"}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
          </ScrollView>
          
        </Card.Content>
      </Card>
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
  card: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 10,
    elevation: 3, // Add elevation for a card-like effect
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  gameItem: {
    marginRight: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  cardImage: {
    width: 80, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    borderRadius: 10,
    marginRight: 10,
  },
  cardText: {
    flex: 1,
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

export default AccountScreen;
