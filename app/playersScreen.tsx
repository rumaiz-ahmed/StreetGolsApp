// ui imports
import Frame from "../component/view";
import {
  Linking,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
import { useEffect, useState } from "react";
import { useStore } from "../function/data";

// Navigation imports
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";
import { auth } from "../firebaseConfig";

type PlayersScreenNavigationProp = NavigationProp<AppStackParamList, "Tab">;

type Props = {
  navigation: PlayersScreenNavigationProp;
};

const Players: React.FC<Props> = ({ navigation }) => {
  const { users, fetchUsers } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Set loading to true before the fetch
    fetchUsers().finally(() => setLoading(false)); // Set loading to false after the fetch
  }, [fetchUsers]);

  if (loading) {
    return <Loading />; // Render the Loading component if loading is true
  }

  const filteredPlayers = users.filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) && user.id !== auth.currentUser?.uid
  );

  const share = async () => {
    try {
      const url = `https://streetgols.com/`;
      await Share.share({
        message: `Check out Street Gols - The Best Sports Community at \n ${url}`,
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Frame
      title="Players"
      rightIcon={() => (
        <Ionicons name="ios-person-add-sharp" size={24} color="white" />
      )}
      centered={false}
      rightIconPress={share}
    >
      <Searchbar
        style={pitch.searchBar}
        placeholder="Search for a player"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredPlayers.length > 0 ? (
        filteredPlayers.map((player, index) => (
          <Card
        key={index}
        onPress={() =>
          navigation.navigate("UserInfo", {
            userId: player.id,
          })
        }
        style={styles.card}
      >
        <View style={styles.cardContent}>
          <View style={styles.avatarAndName}>
            <Avatar.Image source={require("../assets/icon.png")} size={50} />
            <Text style={styles.displayName}>{player.displayName}</Text>
          </View>
        </View>
      </Card>
        ))
      ) : (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text style={{ marginVertical: 10, fontSize: 25 }}>
            Invite Player
          </Text>
          <Button
            style={{ padding: 5, width: "95%" }}
            mode="contained"
            onPress={share}
          >
            Invite
          </Button>
        </View>
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
});

export default Players;
