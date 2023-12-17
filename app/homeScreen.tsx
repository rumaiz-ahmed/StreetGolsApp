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
import { MaterialCommunityIcons } from "@expo/vector-icons";

// functional imports
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../function/data";
import * as Location from "expo-location";
import haversine from "haversine";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";


// Navigation imports
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import Loading from "../component/loading";
import moment from "moment";

type HomeScreenNavigationProp = NavigationProp<AppStackParamList, "Tab">;

type Props = {
  navigation: HomeScreenNavigationProp;
};


countries.registerLocale(enLocale);


const HomeScreen = ({ navigation }: Props) => {
  const { games, fetchGames } = useStore();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );


  const [country, setCountry] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading to true before the fetch
      fetchGames().finally(() => setLoading(false)); // Set loading to false after the fetch

      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
        } else {
          let location = await Location.getCurrentPositionAsync({});
          let geocode = await Location.reverseGeocodeAsync(location.coords);
          setLocation(location);
          setCountry(geocode[0].country);
        }
      })();
    }, [fetchGames])
  );

  if (!location) {
    return <Loading />; // Render the Loading component if location is not available
  }



  

  const gamesWithDistance = games.map((game) => {
    const start = {
      latitude: Number(location.coords.latitude),
      longitude: Number(location.coords.longitude),
    };

    const end = {
      latitude: Number(game.latitude),
      longitude: Number(game.longitude),
    };

    let distance = haversine(start, end);
    let alpha2Code = "US"; // Default to US if country is null

    if (country) {
      const code = countries.getAlpha2Code(country, "en");
      if (code) {
        alpha2Code = code;
      }
    }

    // Check if the country uses the imperial system (miles)
    if (["US", "LR", "MM"].includes(alpha2Code)) {
      // Convert kilometers to miles
      distance *= 0.621371;
    }

    return { ...game, distance, unit: alpha2Code === "US" ? "mi" : "km" };
  });

  const gamesWithinMiles = gamesWithDistance.filter(
    (game) => game.distance <= 32.18688
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0); // set the time to 00:00:00

  const sortedGames = gamesWithinMiles
    .filter((game) => {
      const gameDate = game.date ? new Date(game.date) : new Date();
      return gameDate >= today;
    })
    .sort((a, b) => {
      // Compare by distance first
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }

      const dateA = a.date ? new Date(a.date) : new Date();
      const dateB = b.date ? new Date(b.date) : new Date();

      const timeA = a.startTime
        ? new Date(`1970-01-01T${a.startTime}Z`)
        : new Date();
      const timeB = b.startTime
        ? new Date(`1970-01-01T${b.startTime}Z`)
        : new Date();

      // If distances are equal, compare by date
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }

      // If dates are also equal, compare by start time
      return timeA.getTime() - timeB.getTime();
    });

  return (
    <View style={styles.container}>
      <Frame title="Games" centered={false}>
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
                  <View style={styles.row}>
                    <MaterialCommunityIcons
                      name="map-marker-distance"
                      size={24}
                      color="white"
                      style={styles.icon}
                    />
                     <Text style={styles.text}>
                      Distance: {game.distance.toFixed(2)} {game.unit}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            <View>
              <Text style={styles.noText}>
                No Games Available
              </Text>
              
            </View>
          )}
        </View>
      </Frame>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 20,
  },

  fullWidth: {
    padding: "5%",
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
    fontSize: 24,
    fontWeight: "bold",
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

export default HomeScreen;
