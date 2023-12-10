import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";
import CustomNavigationBar from "./appBar";

interface FrameProps {
  title?: string;
  back?: boolean;
  rightIcon?: any;
  rightIconPress?: () => void;
  children?: React.ReactNode;
  keyboardAvoiding?: boolean;
  centered?: boolean;
}

const Frame: React.FC<FrameProps> = ({
  title,
  back,
  rightIcon,
  rightIconPress,
  children,
  keyboardAvoiding = false,
  centered = true,
}) => {
  const { colors } = useTheme();
  

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <CustomNavigationBar
        title={title}
        back={back}
        rightIcon={rightIcon}
        rightIconPress={rightIconPress}
      />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.centeredContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.centeredContent}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView
          contentContainerStyle={centered ? styles.centeredContent : null}
        >
          {children}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,

    justifyContent: "center",
  },
  centeredContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Frame;
