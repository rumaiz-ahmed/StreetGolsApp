// ui imports
import Frame from "../component/view";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  FAB,
  Searchbar,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import form from "../Styles/forms";
import pitch from "../Styles/pitch";
import Loading from "../component/loading";
import { Ionicons } from "@expo/vector-icons";

// functional imports
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../function/data";

// Navigation imports
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import { auth } from "../firebaseConfig";

type DetailsScreenNavigationProp = NavigationProp<AppStackParamList, "Details">;

type Props = {
  navigation: DetailsScreenNavigationProp;
  route: RouteProp<AppStackParamList, "Details">;
};

const DetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { message, uid } = route.params;
  const { games, fetchGames, user, subscribeUser, users, fetchUsers } =
    useStore();
  const [loading, setLoading] = useState(false);
  const [searchFriends, setSearchFriends] = useState("");
  const [searchOwnedGames, setSearchOwnedGames] = useState("");
  const [searchPlayedGames, setSearchPlayedGames] = useState("");

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading to true before the fetch
      fetchGames().finally(() => setLoading(false)); // Set loading to false after the fetch
      fetchUsers().finally(() => setLoading(false));
      subscribeUser(`${uid}`);
    }, [fetchGames, subscribeUser, fetchGames])
  );

  if (loading) {
    return <Loading />; // Render the Loading component if loading is true
  }

  // Get the friends of the user
  const friends = user?.friends;

  // Cross-check the friends with the users array
  const existingFriends = users.filter((user) => friends?.includes(user.id));

  const createdGames = games.filter(
    (game) => game.creatorUserID === `${auth.currentUser?.uid}`
  );
  const joinedGames = games.filter((game) =>
    game.players.includes(`${auth.currentUser?.uid}`)
  );

  const filteredFriends = existingFriends.filter((friend) =>
    friend.displayName.toLowerCase().includes(searchFriends.toLowerCase())
  );
  const filteredOwnedGames = createdGames.filter((game) =>
    game.name.toLowerCase().includes(searchOwnedGames.toLowerCase())
  );
  const filteredPlayedGames = joinedGames.filter((game) =>
    game.name.toLowerCase().includes(searchPlayedGames.toLowerCase())
  );

  return (
    <Frame back title={message} centered={false}>
      {message === "Friends" && (
        <>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search Friends"
            onChangeText={setSearchFriends}
            value={searchFriends}
          />
          {filteredFriends.map((friend, index) => (
            <Card
              key={index}
              onPress={() =>
                navigation.navigate("UserInfo", {
                  userId: friend.id,
                })
              }
              style={styles.card}
            >
              <View style={styles.cardContent}>
                <View style={styles.avatarAndName}>
                  <Avatar.Image
                    source={require("../assets/icon.png")}
                    size={50}
                  />
                  <Text style={styles.displayName}>{friend.displayName}</Text>
                </View>
              </View>
            </Card>
          ))}
        </>
      )}

      {message === "Games Created" && (
        <>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search Created Games"
            onChangeText={setSearchOwnedGames}
            value={searchOwnedGames}
          />
          {filteredOwnedGames.map((game, index) => (
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
                  <Text style={styles.cardTitle}>{game.name}</Text>
                  <Text> {game.date}</Text>
                </View>
              </View>
            </Card>
          ))}
        </>
      )}

      {message === "Games Played" && (
        <>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search Played Games"
            onChangeText={setSearchPlayedGames}
            value={searchPlayedGames}
          />
          {filteredPlayedGames.map((game, index) => (
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
                </View>
              </View>
            </Card>
          ))}
        </>
      )}
    </Frame>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginBottom: 10,
    marginHorizontal: 10,
  },
  card: {
    margin: 10,
    padding: 10,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarAndName: {
    flexDirection: "row",
    alignItems: "center",
  },
  displayName: {
    marginLeft: 10,
    marginRight: "auto", // Pushes the "Follow" button to the far right
  },
  followButton: {
    marginLeft: 10,
  },
  noPeopleMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
});

export default DetailsScreen;
