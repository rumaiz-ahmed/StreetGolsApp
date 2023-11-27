import * as React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useTheme } from "react-native-paper";

function Loading() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <ActivityIndicator animating={true} size={"large"} />
    </View>
  );
}

export default Loading;
