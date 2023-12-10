// ui imports
import Frame from "../component/view";
import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import {
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

type PitchesScreenNavigationProp = NavigationProp<AppStackParamList, "Pitches">;

type Props = {
  navigation: PitchesScreenNavigationProp;
};

const Pitches: React.FC<Props> = ({ navigation }) => {
  const { playgrounds, fetchPlaygrounds } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Set loading to true before the fetch
    fetchPlaygrounds().finally(() => setLoading(false)); // Set loading to false after the fetch
  }, [fetchPlaygrounds]);

  if (loading) {
    return <Loading />; // Render the Loading component if loading is true
  }

  const filteredPlaygrounds = playgrounds.filter((playground) =>
    playground.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Frame
      title="Pitches"
      back
      centered={false}
      rightIcon={() => (
        <Ionicons name="ios-add-circle-sharp" size={24} color="white" />
      )}
      rightIconPress={() =>
        Linking.openURL("https://forms.gle/MWsQy3zi6MEaSwY96")
      }
    >
      <Searchbar
        style={pitch.searchBar}
        placeholder="Search for a pitch"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredPlaygrounds.length > 0 ? (
        filteredPlaygrounds.map((playground) => (
          <TouchableOpacity
            key={playground.id}
            onPress={() =>
              navigation.navigate("PitchInfo", {
                pitchId: playground.id,
              })
            }
          >
            <Card style={pitch.card}>
              <View style={pitch.cardContent}>
                <Card.Cover
                  source={{ uri: playground.imageURL }}
                  style={pitch.cardImage}
                  resizeMode="cover"
                />
                <View style={pitch.cardText}>
                  <Text style={pitch.cardTitle}>{playground.name}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))
      ) : (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text style={{ marginVertical: 10 }}>
            Not What your Looking for! Just Ask
          </Text>
          <Button
            mode="contained"
            onPress={() =>
              Linking.openURL("https://forms.gle/MWsQy3zi6MEaSwY96")
            }
          >
            Request New Pitch
          </Button>
        </View>
      )}
    </Frame>
  );
};

export default Pitches;
