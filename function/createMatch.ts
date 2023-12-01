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
  playgorundImage: any; 
  name: any;
  addedGame: number;
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
  playgorundImage,
  name,
  addedGame
}: CreateMatchData) => {
  try {
    const gameDoc = doc(db, "game", `${gameId}`);
    await setDoc(gameDoc, {
      playgroundId: playgroundId,
      id: gameId ? gameId.toString() : undefined,
      date: date,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      Intensity: matchTypes,
      additionalNotes: additionalNotes || "",
      creator: auth.currentUser?.displayName,
      numberOfPlayers: numberOfPlayers,
      creatorUserID: auth.currentUser?.uid,
      players: [],
      playersPushToken: [],
      playgorundImage: playgorundImage,
      name: name,
    });

    const userDoc = doc(db, "users", auth.currentUser?.uid || "");
      await updateDoc(userDoc, {
        gamesCreated: addedGame,
      });
  } catch (error) {
    throw error;
  }
};