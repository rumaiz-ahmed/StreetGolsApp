import React from "react";
import { Text, View } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";

type SettingsScreenNavigationProp = NavigationProp<
  AppStackParamList,
  "Settings"
>;

type Props = {
  navigation: SettingsScreenNavigationProp;
};

const SettingsScreen = ({ navigation }: Props) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Settings Screen</Text>
    </View>
  );
};

export default SettingsScreen;
