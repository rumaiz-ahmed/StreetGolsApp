// ui imports
import Frame from "../component/view";
import {
  Image,
  Linking,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  Divider,
  FAB,
  Paragraph,
  Snackbar,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import form from "../Styles/forms";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

// functional imports
import { useEffect, useState } from "react";
import { useStore } from "../function/data";

// Navigation imports
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import Loading from "../component/loading";
import moment from "moment";
import { auth, db } from "../firebaseConfig";
import { handleJoin, handleUnjoin } from "../function/gameEntry";
import { doc, updateDoc } from "firebase/firestore";
import deleteGame from "../function/deleteGame";

type GameInfoScreenNavigationProp = NavigationProp<
  AppStackParamList,
  "GameInfo"
>;

type Props = {
  navigation: GameInfoScreenNavigationProp;
  route: RouteProp<AppStackParamList, "GameInfo">;
};

const GameInfoScreen = ({ navigation, route }: Props) => {
  const { gameId } = route.params;
  const { game, subscribeGame, user, subscribeUser, users, fetchUsers } =
    useStore();
  const [isLoading, setIsLoading] = useState(true);

  const share = async () => {
    try {
      const url = `https://streetgols.com/gameInfo/${route.params.gameId}`;
      await Share.share({
        message: `Check out this pitch \n ${url}`,
      });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      subscribeGame(gameId),
      subscribeUser(`${auth.currentUser?.uid}`),
      fetchUsers(),
    ]).then(() => setIsLoading(false));
  }, [subscribeGame, subscribeUser, fetchUsers]);

  const userId = auth.currentUser?.uid || "";
  const isUserInGame = game?.players.includes(userId);
  const gamePlayers = game?.players || [];
  const creatorUserId = game?.creatorUserID || "";
  const isUserCreator = userId === creatorUserId;

  let buttonLabel = "";
  let buttonAction = () => {};

  const minusGame = (user?.gamesCreated || 0) - 1;
  const minusPlayedGame = (user?.gamesPlayed || 0) - 1;
  const addedPlayedGame = (user?.gamesPlayed || 0) + 1;

  if (isUserCreator) {
    buttonLabel = "Delete";
    buttonAction = () => deleteGame({ gameId, minusGame });
  } else if (isUserInGame) {
    buttonLabel = "Unjoin";
    buttonAction = async () => {
      const userDoc = doc(db, "users", auth.currentUser?.uid || "");
      await updateDoc(userDoc, {
        gamesPlayed: minusPlayedGame,
      });
      await handleUnjoin({ gamePlayers, gameId });
      //   navigation.navigate("Success", { screenFrom: "Unjoined Game" });
    };
  } else {
    buttonLabel = "Join";
    buttonAction = async () => {
      const userDoc = doc(db, "users", auth.currentUser?.uid || "");
      await updateDoc(userDoc, {
        gamesPlayed: addedPlayedGame,
      });
      await handleJoin({ gamePlayers, gameId });
      //   navigation.navigate("Success", { screenFrom: "Joined Game" });
    };
  }

  if (isLoading) {
    return <Loading />;
  }

  const formattedAddress = `${game?.playAddress}, ${game?.city}, ${game?.state}, ${game?.zip}`;
  const playerRatio = `${game?.players.length}/${game?.numberOfPlayers}`;
  const gameStartTime = moment(game?.startTime).format("h:mm A");
  const gameEndTime = moment(game?.endTime).format("h:mm A");
  const gameDuration =
    moment(game?.endTime).diff(game?.startTime, "hours") + " hrs";

  return (
    <>
      <Button style={styles.button} mode="contained" onPress={buttonAction}>
        {buttonLabel}
      </Button>
      <Frame
        back
        title={game?.name}
        rightIcon={() => <Entypo name="share" size={24} color="white" />}
        rightIconPress={share}
      >
        <Image source={{ uri: game?.imageURL }} style={styles.image} />

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Game Details</Text>
            <Divider style={styles.divider} />
            <View style={styles.gameDetailsContainer}>
              <View style={styles.gameDetailItem}>
                <Text style={styles.gameDetailLabel}>Match Type:</Text>

                <View>
                  <Text style={styles.gameDetailText}>{game?.intensity}</Text>
                </View>
              </View>
              <Divider />
              <View style={styles.gameDetailItem}>
                <Text style={styles.gameDetailLabel}>Additional Notes:</Text>

                <View>
                  <Text style={styles.gameDetailText}>
                    {game?.additionalNotes}
                  </Text>
                </View>
              </View>
              <Divider />
              <View style={styles.gameDetailItem}>
                <Text style={styles.gameDetailLabel}>Address:</Text>

                <View>
                  <Text
                    style={styles.gameDetailText}
                    onPress={() => {
                      if (game?.mapURL) {
                        Linking.openURL(game.mapURL);
                      }
                    }}
                  >
                    {formattedAddress}
                  </Text>
                </View>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.timeContainer}>
              <View style={styles.timeDetailItem}>
                <Text style={styles.timeLabel}>Start Time</Text>
                <Text style={styles.timeText}>{gameStartTime}</Text>
              </View>
              <View style={styles.middleContainer}>
                <Text style={styles.middleText}>Duration</Text>
                <Text style={styles.middleTimeText}>{gameDuration}</Text>
              </View>
              <View style={styles.timeDetailItem}>
                <Text style={styles.timeLabel}>End Time</Text>
                <Text style={styles.timeText}>{gameEndTime}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.playerListHeader}>
              <Text style={styles.sectionTitle}>Player List</Text>
              <Text style={styles.playerRatioText}>{playerRatio} Players</Text>
            </View>
            <Divider style={styles.divider} />
            {users &&
              game &&
              game.players.map((playerId, index) => {
                const player = users.find((user) => user.id === playerId);
                return (
                  <View key={index} style={{ marginVertical: 10 }}>
                    <TouchableOpacity style={styles.playerContainer}
                    onPress={() =>
                      navigation.navigate("UserInfo", { userId: player?.id })
                    }
                    >
                      <FontAwesome
                        name="user"
                        size={20}
                        color="white"
                        style={styles.icon}
                      />
                      <Text style={styles.playerName}>
                        {player?.displayName}
                      </Text>
                    </TouchableOpacity>
                    <Divider />
                  </View>
                );
              })}
          </Card.Content>
        </Card>
      </Frame>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  image: {
    height: 400,
    width: "95%",
    borderRadius: 10,
    marginBottom: 20,
  },
  card: {
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
    width: "95%",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    position: "absolute",
    bottom: 10,
    borderRadius: 10,
    padding: 5,
    alignSelf: "center",
    width: "90%",
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  playerName: {
    fontSize: 16,
    color: "white",
  },
  buttonIcon: {
    marginRight: 10,
  },
  playerListHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerRatioText: {
    fontSize: 16,
    color: "yellow",
  },
  timeLabelContainer: {
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "yellow",
  },
  timeDetailItem: {
    flexDirection: "column",
  },
  timeText: {
    fontSize: 16,
  },
  middleContainer: {
    alignItems: "center",
  },
  middleText: {
    fontSize: 16,
    color: "yellow",
  },
  middleTimeText: {
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addressContainer: {
    flex: 1,
  },
  address: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
  },
  openMapsButton: {
    marginLeft: 10,
    borderRadius: 10,
  },
  gameDetailsContainer: {
    marginBottom: 10,
  },
  gameDetailItem: {
    flexDirection: "column",
    marginBottom: 10,
    marginTop: 10,
  },
  gameDetailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
    color: "yellow",
  },
  gameDetailText: {
    fontSize: 16,
    color: "white",
  },
});

export default GameInfoScreen;
