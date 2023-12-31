import React, { useContext, useEffect, useState } from "react";

// Navigation imports and for deep linking
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";

// imports for Auth
import { AuthenticatedUserContext } from "../context/AuthenticatedUserProvider";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

// other imports
import Loading from "../component/loading";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { darkTheme } from "../theme";

// Auth Screens
import WelcomeScreen from "../auth/welcomeScreen";
import SignInScreen from "../auth/signInScreen";
import SignUpScreen from "../auth/signUpScreen";
import PitchInfoScreen from "../app/pitchInfoScreen";
import ForgotPasswordScreen from "../auth/forgotPasswordScreen";

// App Screens
import HomeScreen from "../app/homeScreen";
import SettingsScreen from "../app/settingsScreen";
import Pitches from "../app/pitchesScreen";
import CreateMatchScreen from "../app/createMatchScreen";
import GameInfoScreen from "../app/gameInfoScreen";
import Players from "../app/playersScreen";
import UserInfoScreen from "../app/userInfoScreen";
import AccountScreen from "../app/accountScreen";
import EditAccountScreen from "../app/editAccountScreen";
import ConfirmScreen from "../app/confirmScreen";
import MyGamesScreen from "../app/myGamesScreen";
import DetailsScreen from "../app/deatilsScreen";

// Tab Flow

export type TabStackParamList = {
  Home: undefined;
  Players: undefined;
  Account: undefined;
  MyGames: undefined;
};

const TabStacker = createMaterialBottomTabNavigator<TabStackParamList>();

const TabStack = () => {
  return (
    <TabStacker.Navigator initialRouteName="Home" theme={darkTheme}>
      <TabStacker.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <TabStacker.Screen
        name="MyGames"
        component={MyGamesScreen}
        options={{
          tabBarLabel: "My Games",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="soccer-field"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <TabStacker.Screen
        name="Players"
        component={Players}
        options={{
          tabBarLabel: "Friends",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-multiple"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <TabStacker.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </TabStacker.Navigator>
  );
};

// App Flow

export type AppStackParamList = {
  Tab: undefined;
  Settings: undefined;
  Pitches: undefined;
  EditAccount: undefined;
  Details: { message: string, uid: any };
  Confirm: { message: string };
  UserInfo: { userId: any };
  PitchInfo: { pitchId: string };
  CreateMatch: { pitchId: string };
  GameInfo: { gameId: any };
};

const AppStacker = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <AppStacker.Navigator>
      <AppStacker.Screen
        name="Tab"
        component={TabStack}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="Pitches"
        component={Pitches}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="PitchInfo"
        component={PitchInfoScreen}
        initialParams={{ pitchId: "1" }}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="CreateMatch"
        component={CreateMatchScreen}
        initialParams={{ pitchId: "1" }}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="GameInfo"
        component={GameInfoScreen}
        initialParams={{ gameId: "" }}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="UserInfo"
        component={UserInfoScreen}
        initialParams={{ userId: "" }}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="EditAccount"
        component={EditAccountScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="Confirm"
        component={ConfirmScreen}
        initialParams={{ message: "" }}
        options={{
          headerShown: false,
        }}
      />
      <AppStacker.Screen
        name="Details"
        component={DetailsScreen}
        initialParams={{ message: "", uid: "" }}
        options={{
          headerShown: false,
        }}
      />
    </AppStacker.Navigator>
  );
};

// Authentication Flow

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

const AuthStacker = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <AuthStacker.Navigator>
      <AuthStacker.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStacker.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStacker.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStacker.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false,
        }}
      />
    </AuthStacker.Navigator>
  );
};

// Linking Config
const prefix = Linking.createURL("/");

// Logic for switching between Auth Flow and App Flow

const RootNavigation = () => {
  // Route Config for DeepLinking ### NO TOUCH ####
  const linking = {
    prefixes: [prefix, "streetgols://", "https://streetgols.com"],
    config: {
      screens: {
        Tab: "tab",
        PitchInfo: "pitchInfo/:pitchId",
        GameInfo: "gameInfo/:gameId",
        UserInfo: "userInfo/:userId",
        Settings: "settings",
        Welcome: "welcome",
        SignIn: "signIn",
        SignUp: "signUp",
        ForgotPassword: "forgotPassword",
      },
    },
  };

  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer linking={linking} fallback={<Loading />}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigation;
