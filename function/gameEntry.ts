import { db, auth } from "../firebaseConfig";
import { doc, updateDoc, arrayUnion,arrayRemove } from "firebase/firestore";

export const handleJoin = async ({
  gamePlayers,
  gameId,
  pushToken,
}: {
  gamePlayers: string[];
  gameId: string;
  pushToken: any
}) => {
  try {
    const gameDoc = doc(db, "game", gameId);
    await updateDoc(gameDoc, {
      players: [...gamePlayers, auth.currentUser?.uid],
      playersPushToken: arrayUnion(pushToken)
    });

  } catch (error) {
    throw error;
  }
};

export const handleUnjoin = async ({
  gamePlayers,
  gameId,
  pushToken
}: {
  gamePlayers: string[];
  gameId: string;
pushToken: any;
}) => {
  try {
    const gameDoc = doc(db, "game", gameId);
    // delete the player from the player array
    await updateDoc(gameDoc, {
      players: [
        ...gamePlayers.filter((player) => player !== auth.currentUser?.uid),
      ],
      playersPushToken: arrayRemove(pushToken)
    });
   
  } catch (error) {
    throw error;
  }
};