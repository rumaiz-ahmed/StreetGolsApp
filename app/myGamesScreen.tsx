// ui imports
import Frame from "../component/view";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  FAB,
  Paragraph,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import form from "../Styles/forms";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// functional imports
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../function/data";

// Navigation imports
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import Loading from "../component/loading";
import moment from "moment";
import { auth } from "../firebaseConfig";

type HomeScreenNavigationProp = NavigationProp<AppStackParamList, "Tab">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const MyGamesScreen = ({ navigation }: Props) => {
  const { games, fetchGames } = useStore();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading to true before the fetch
      fetchGames().finally(() => setLoading(false)); // Set loading to false after the fetch
    }, [fetchGames])
  );

  if (loading) {
    return <Loading />; // Render the Loading component if loading is true
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // set the time to 00:00:00

  const filteredGames = games.filter((game) => {
    const gameDate = game.date ? new Date(game.date) : new Date();
    return gameDate >= today;
  });

  const sortedGames = filteredGames.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date();
    const dateB = b.date ? new Date(b.date) : new Date();

    const timeA = a.startTime
      ? new Date(`1970-01-01T${a.startTime}Z`)
      : new Date();
    const timeB = b.startTime
      ? new Date(`1970-01-01T${b.startTime}Z`)
      : new Date();

    // Compare by date first
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    // If dates are equal, compare by start time
    return timeA.getTime() - timeB.getTime();
  });

  const createdGames = games.filter(
    (game) => game.creatorUserID === `${auth.currentUser?.uid}`
  );
  const joinedGames = games.filter((game) =>
    game.players.includes(`${auth.currentUser?.uid}`)
  );

  return (
    <View style={styles.container}>
      <Frame title="My Games" centered={false}>
        <View style={styles.fullWidth}>
        {(createdGames.length > 0 || joinedGames.length > 0) ? (
            <View>
              <Text style={styles.sectionTitle}>Created Games</Text>
              <ScrollView horizontal>
                {createdGames.map((game, index) => (
                  <Card
                    key={index}
                    style={styles.horizontalCard}
                    onPress={() =>
                      navigation.navigate("GameInfo", {
                        gameId: game.id,
                      })
                    }
                  >
                    <Card.Title title={game.name} titleStyle={styles.title} />
                    <Card.Cover source={{ uri: game.imageURL }} />
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.row}>
                        <MaterialCommunityIcons
                          name="run-fast"
                          size={24}
                          color="white"
                          style={styles.icon}
                        />
                        <Text style={styles.text}>{game.intensity}</Text>
                      </View>
                      <View style={styles.row}>
                        <MaterialCommunityIcons
                          name="clock-time-four-outline"
                          size={24}
                          color="white"
                          style={styles.icon}
                        />
                        <Text style={styles.text}>
                          Start Time: {moment(game.startTime).format("hh:mm A")}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <MaterialCommunityIcons
                          name="calendar-month-outline"
                          size={24}
                          color="white"
                          style={styles.icon}
                        />
                        <Text style={styles.text}>
                          Date: {moment(game.date).format("MMMM Do YYYY")}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                ))}
              </ScrollView>
              <Text style={styles.sectionTitle}>Joined Games</Text>
              {joinedGames.map((game, index) => (
                <Card
                  key={index}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate("GameInfo", {
                      gameId: game.id,
                    })
                  }
                >
                  <Card.Title title={game.name} titleStyle={styles.title} />
                  <Card.Cover source={{ uri: game.imageURL }} />
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.row}>
                      <MaterialCommunityIcons
                        name="run-fast"
                        size={24}
                        color="white"
                        style={styles.icon}
                      />
                      <Text style={styles.text}>{game.intensity}</Text>
                    </View>
                    <View style={styles.row}>
                      <MaterialCommunityIcons
                        name="clock-time-four-outline"
                        size={24}
                        color="white"
                        style={styles.icon}
                      />
                      <Text style={styles.text}>
                        Start Time: {moment(game.startTime).format("hh:mm A")}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <MaterialCommunityIcons
                        name="calendar-month-outline"
                        size={24}
                        color="white"
                        style={styles.icon}
                      />
                      <Text style={styles.text}>
                        Date: {moment(game.date).format("MMMM Do YYYY")}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          ) : (
            <View>
              <Text style={styles.noText}>
                No Upcoming Games
              </Text>
              
            </View>
          )}
        </View>
      </Frame>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          navigation.navigate("Pitches");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
  },

  fullWidth: {
    padding: "5%",
  },

  horizontalCard: {
    marginBottom: 20,
    borderRadius: 15,
    padding: 10,
    marginLeft: 10,
  },

  noText: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
  },
  cardContent: {
    paddingTop: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },

  card: {
    marginBottom: 20,
    borderRadius: 20,
    padding: 5, // Lower the padding
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5, // Reduce the margin
  },
  text: {
    fontSize: 16,
    marginBottom: 5, // Reduce the margin
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5, // Reduce the margin
  },
  icon: {
    marginRight: 10, // Add some margin to the right of the icon
  },
});

export default MyGamesScreen;