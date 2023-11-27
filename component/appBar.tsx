import React from "react";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

interface CustomNavigationBarProps {
  title: any;
  back?: boolean;
  rightIcon?: any;
  rightIconPress?: () => void;
}

const CustomNavigationBar: React.FC<CustomNavigationBarProps> = ({
  title,
  back,
  rightIcon,
  rightIconPress,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRightIconPress = () => {
    if (rightIconPress) {
      rightIconPress();
    }
  };

  return (
    <Appbar.Header>
      {back && <Appbar.BackAction onPress={handleBack} />}
      <Appbar.Content title={title} />
      {rightIcon && (
        <Appbar.Action icon={rightIcon} onPress={handleRightIconPress} />
      )}
    </Appbar.Header>
  );
};

export default CustomNavigationBar;
