import { db, auth } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export const handleJoin = async ({
  gamePlayers,
  gameId,

}: {
  gamePlayers: string[];
  gameId: string;

}) => {
  try {
    const gameDoc = doc(db, "game", gameId);
    await updateDoc(gameDoc, {
      players: [...gamePlayers, auth.currentUser?.uid],
    });

  } catch (error) {
    throw error;
  }
};

export const handleUnjoin = async ({
  gamePlayers,
  gameId,

}: {
  gamePlayers: string[];
  gameId: string;

}) => {
  try {
    const gameDoc = doc(db, "game", gameId);
    // delete the player from the player array
    await updateDoc(gameDoc, {
      players: [
        ...gamePlayers.filter((player) => player !== auth.currentUser?.uid),
      ],
    });
   
  } catch (error) {
    throw error;
  }
};