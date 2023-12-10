// ui imports
import Frame from "../component/view";
import { FlatList, StyleSheet, View } from "react-native";
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

type HomeScreenNavigationProp = NavigationProp<AppStackParamList, "Tab">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen = ({ navigation }: Props) => {
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

  return (
    <View style={styles.container}>
      <Frame title="Home">
        <View style={styles.fullWidth}>
          {sortedGames.length > 0 ? (
            sortedGames.map((game, index) => (
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
                  <Text style={styles.text}>{game.intensity}</Text>
                  <Text style={styles.text}>
                    Start Time: {moment(game.startTime).format("hh:mm A")}
                  </Text>
                  <Text style={styles.text}>
                    Date: {moment(game.date).format("MMMM Do YYYY")}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <View>
              <Text style={styles.noText}>
                No games available. Please create one.
              </Text>
              <Button
                style={{ padding: 5, marginVertical: 20, width: "50%", alignSelf: "center" }}
                mode="contained"
                onPress={() => {
                  navigation.navigate("Pitches");
                }}
              >
                Create One
              </Button>
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
  container: {
    flex: 1,
  },

  fullWidth: {
    width: "90%",
  },
  card: {
    marginBottom: 20,
    borderRadius: 15,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
   
  },
  noText:{
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center"
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
});

export default HomeScreen;
