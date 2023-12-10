import { auth, db } from "../firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";

interface CreateMatchData {
  playgroundId: string;
  date: string | null;
  startTime: string;
  endTime: string;
  numberOfPlayers: number;
  additionalNotes: string;
  matchTypes: string;
  gameId: string | null | undefined;
  imageURL: any;
  name: any;
  addedGame: number;
  playAddress: string | null | undefined;
  city:  string | null | undefined;
  state:  string | null | undefined;
  country:  string | null | undefined;
  zip:  string | null | undefined;
  mapURL: string | null | undefined;
}

export const CreateMatchFunction = async ({
  date,
  endTime,
  startTime,
  numberOfPlayers,
  additionalNotes,
  matchTypes,
  gameId,
  playgroundId,
  name,
  addedGame,
  imageURL,
  city,
  country,
  mapURL,
  playAddress,
  state,
  zip,
}: CreateMatchData) => {
  try {
    const gameDoc = doc(db, "game", `${gameId}`);
    await setDoc(gameDoc, {
      playgroundId: playgroundId,
      id: gameId ? gameId.toString() : undefined,
      date: date,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      intensity: matchTypes,
      additionalNotes: additionalNotes || "",
      creator: auth.currentUser?.displayName,
      numberOfPlayers: numberOfPlayers,
      creatorUserID: auth.currentUser?.uid,
      players: [],
      playersPushToken: [],
      imageURL: imageURL,
      name: name,
      city: city,
      country: country,
      mapURL: mapURL,
      playAddress: playAddress,
      state: state,
      zip: zip,
    });

    const userDoc = doc(db, "users", auth.currentUser?.uid || "");
    await updateDoc(userDoc, {
      gamesCreated: addedGame,
    });
  } catch (error) {
    throw error;
  }
};
