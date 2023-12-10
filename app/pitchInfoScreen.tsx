// ui imports
import Frame from "../component/view";
import { StyleSheet, Image, View, Share, Linking } from "react-native";
import { Button, Card, Divider, FAB, Snackbar, Text } from "react-native-paper";
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

type PitchInfoScreenNavigationProp = NavigationProp<
  AppStackParamList,
  "PitchInfo"
>;

type Props = {
  navigation: PitchInfoScreenNavigationProp;
  route: RouteProp<AppStackParamList, "PitchInfo">;
};

const PitchInfoScreen = ({ navigation, route }: Props) => {
  const { playground, subscribePlayground } = useStore();
  const { pitchId } = route.params;

  useEffect(() => {
    subscribePlayground(pitchId);
  }, [subscribePlayground]);

  const share = async () => {
    try {
      const url = `https://streetgols.com/pitchInfo/${route.params.pitchId}`;
      await Share.share({
        message: `Check out this pitch \n ${url}`,
      });
    } catch (error) {
      alert(error);
    }
  };
  // Combine address fields into a single formatted address

  const formattedAddress = `${playground?.playAddress}, ${playground?.city}, ${playground?.state}, ${playground?.zip}`;

  return (
    <Frame
      back
      title={playground?.name}
      centered={false}
      rightIcon={() => <Entypo name="share" size={24} color="white" />}
      rightIconPress={share}
    >
      <Image source={{ uri: playground?.imageURL }} style={pitchInfo.image} />

      <Card style={pitchInfo.card}>
        <Card.Content>
          <Text style={pitchInfo.sectionTitle}>Playground Details</Text>
          <Divider style={pitchInfo.divider} />
          <View style={pitchInfo.gameDetailsContainer}>
            <View style={pitchInfo.gameDetailItem}>
              <View style={pitchInfo.gameDetailItem}>
                <Text style={pitchInfo.gameDetailLabel}>Address:</Text>

                <View>
                  <Text
                    style={pitchInfo.gameDetailText}
                    onPress={() => {
                      if (playground?.mapURL) {
                        Linking.openURL(playground.mapURL);
                      }
                    }}
                  >
                    {formattedAddress}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Divider style={pitchInfo.divider} />
          <View style={pitchInfo.timeContainer}>
            <View style={pitchInfo.timeDetailItem}>
              <Text style={pitchInfo.timeLabel}>Open Time</Text>
              <Text style={pitchInfo.timeText}>{playground?.openTime}</Text>
            </View>
            <View style={pitchInfo.timeDetailItem}>
              <Text style={pitchInfo.timeLabel}>Close Time</Text>
              <Text style={pitchInfo.timeText}>{playground?.closeTime}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Button
        style={pitchInfo.button}
        labelStyle={pitchInfo.buttonIcon}
        mode="contained"
        onPress={() => {
          navigation.navigate("CreateMatch", {
            pitchId: route.params.pitchId,
          });
        }}
      >
        Use this Pitch
      </Button>
    </Frame>
  );
};

export default PitchInfoScreen;
