// ui imports
import Frame from "../component/view";
import { StyleSheet, Image, View, Share, Linking } from "react-native";
import {
  Button,
  Card,
  Divider,
  FAB,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import DateTimePicker from "react-native-modal-datetime-picker";

// functional imports
import { useEffect, useState } from "react";
import { useStore } from "../function/data";
import { auth } from "../firebaseConfig";
import moment from "moment";
import { CreateMatchFunction } from "../function/createMatch";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

// Navigation imports
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../navigation/root";

type CreateMatchScreenNavigationProp = NavigationProp<
  AppStackParamList,
  "CreateMatch"
>;

type Props = {
  navigation: CreateMatchScreenNavigationProp;
  route: RouteProp<AppStackParamList, "CreateMatch">;
};

const CreateMatchScreen = ({ navigation, route }: Props) => {
  const { pitchId } = route.params;

  const {
    user,
    subscribeUser,
    playground,
    subscribePlayground,
    users,
    fetchUsers,
  } = useStore();

  useEffect(() => {
    subscribeUser(`${auth.currentUser?.uid}`);
    subscribePlayground(pitchId);
    fetchUsers();
  }, [subscribeUser, subscribePlayground, fetchUsers]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<Date | null>(null);
  const [selectedEndTime, setSelectedEndTime] = useState<Date | null>(null);
  const [additionalNote, setAdditionalNote] = useState<string | "">("");
  const [numberOfPlayer, setNumberOfPlayer] = useState<number>(0);
  const [matchType, setMatchType] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] =
    useState<boolean>(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] =
    useState<boolean>(false);

  const handleDateChange = (selectedDate: Date) => {
    setSelectedDate(selectedDate);
  };

  const handleStartTimeChange = (selectedTime: Date) => {
    setSelectedStartTime(selectedTime);
  };

  const handleEndTimeChange = (selectedTime: Date) => {
    setSelectedEndTime(selectedTime);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisible(false);
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisible(false);
  };

  const handleCreateMatch = async () => {
    if (
      !selectedDate ||
      !selectedStartTime ||
      !selectedEndTime ||
      numberOfPlayer <= 0 ||
      !matchType
    ) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarVisible(true);
      return;
    }

    const playgroundId = route.params.pitchId;
    const date = selectedDate?.toDateString() ?? "";
    const startTime = selectedStartTime?.toISOString() ?? "";
    const endTime = selectedEndTime?.toISOString() ?? "";
    const numberOfPlayers = numberOfPlayer;
    const additionalNotes = additionalNote;
    const imageURL = playground?.imageURL;
    const name = playground?.name;
    const addedGame = (user?.gamesCreated ?? 0) + 1;
    const gameId = uuidv4();
    const city = playground?.city;
    const country = playground?.country;
    const mapURL = playground?.imageURL;
    const playAddress = playground?.playAddress;
    const state = playground?.state;
    const zip = playground?.zip;
    const latitude = playground?.latitude;
    const longitude = playground?.longitude;
    const creatorPushToken = user?.pushToken || "";

    try {
      await CreateMatchFunction({
        date,
        endTime,
        playgroundId,
        startTime,
        numberOfPlayers,
        additionalNotes,
        matchTypes: matchType || "",
        gameId,
        imageURL,
        name,
        addedGame,
        city,
        country,
        mapURL,
        playAddress,
        state,
        zip,
        longitude,
        latitude,
        creatorPushToken,
      });
      try {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          if (user.pushToken) {
            const message = {
              to: user.pushToken,
              sound: "default",
              title: "New Game Created",
              body: `A new game has been created. Check it out!`,
              data: { data: "goes here" },
            };
            await fetch("https://exp.host/--/api/v2/push/send", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(message),
            }).then(() => {
              navigation.navigate("Confirm", { message: "Created Match" });
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!user?.pushToken) {
    return (
      <Frame back>
        <Text style={{ fontSize: 16, textAlign: "center", margin: 10 }}>
          Sorry, you cannot create a game right now. Please ensure you have
          allowed notifications in your settings and try again.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("EditAccount")}
        >
          Settings
        </Button>
      </Frame>
    );
  }
  return (
    <Frame back title="Create Match" keyboardAvoiding>
      <View style={{ width: "90%", marginBottom: 16 }}>
        <TextInput
          label="Date"
          value={
            selectedDate ? moment(selectedDate).format("MMMM Do YYYY") : ""
          }
          editable={false}
          right={<TextInput.Icon icon="calendar" onPress={showDatePicker} />}
        />
        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()}
          onConfirm={(date) => {
            handleDateChange(date);
            hideDatePicker(); // Hide the date picker after selecting a date
          }}
          onCancel={hideDatePicker} // Also hide the date picker on cancel
        />
      </View>

      <View style={{ width: "90%", marginBottom: 16 }}>
        <TextInput
          label="Start Time"
          value={
            selectedStartTime ? moment(selectedStartTime).format("h:mm A") : ""
          }
          editable={false}
          right={
            <TextInput.Icon
              icon="clock-outline"
              onPress={showStartTimePicker}
            />
          }
        />
        <DateTimePicker
          isVisible={isStartTimePickerVisible}
          mode="time"
          is24Hour={false}
          onConfirm={(time) => {
            handleStartTimeChange(time);
            hideStartTimePicker(); // Hide the start time picker after selecting a time
          }}
          onCancel={hideStartTimePicker} // Also hide the start time picker on cancel
        />
      </View>

      <View style={{ width: "90%", marginBottom: 16 }}>
        <TextInput
          label="End Time"
          value={
            selectedEndTime ? moment(selectedEndTime).format("h:mm A") : ""
          }
          editable={false}
          right={
            <TextInput.Icon icon="clock-outline" onPress={showEndTimePicker} />
          }
        />
        <DateTimePicker
          isVisible={isEndTimePickerVisible}
          mode="time"
          is24Hour={false}
          onConfirm={(time) => {
            handleEndTimeChange(time);
            hideEndTimePicker(); // Hide the end time picker after selecting a time
          }}
          onCancel={hideEndTimePicker} // Also hide the end time picker on cancel
        />
      </View>

      <TextInput
        style={{ width: "90%", alignSelf: "center", marginBottom: 16 }}
        placeholder="Number Of Players"
        value={numberOfPlayer ? numberOfPlayer.toString() : ""}
        onChangeText={(text) => setNumberOfPlayer(parseInt(text))}
        keyboardType="numeric"
      />

      <View
        style={{
          width: "90%",
          justifyContent: "center",
          alignSelf: "center",
          marginBottom: 16,
        }}
      >
        <DropDown
          dropDownStyle={{ width: "90%" }}
          label="Match Type"
          value={matchType}
          activeColor="yellow"
          dropDownItemTextStyle={{
            color: "white",
          }}
          setValue={setMatchType}
          list={[
            { label: "Recreational", value: "Recreational" },
            { label: "Competitive", value: "Competitive" },
          ]}
          visible={visible}
          showDropDown={() => setVisible(true)}
          onDismiss={() => setVisible(false)}
        />
      </View>

      <TextInput
        style={{ width: "90%", alignSelf: "center", marginBottom: 16 }}
        placeholder="Additional Notes"
        value={additionalNote}
        onChangeText={(text) => setAdditionalNote(text)}
        inputMode="text"
      />

      <Button
        onPress={() => handleCreateMatch()}
        mode="contained"
        style={{ width: "90%", alignSelf: "center", marginBottom: 16 }}
      >
        Create Match
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </Frame>
  );
};

const styles = StyleSheet.create({});

export default CreateMatchScreen;
