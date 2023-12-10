import { auth, db } from "../firebaseConfig";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const deleteGame = async ({gameId, minusGame}: {gameId: string, minusGame: number}) => {
 try {

    const deletedoc = doc(db, "game", gameId);
    await deleteDoc(deletedoc);
    const userDoc = doc(db, "users", auth.currentUser?.uid || "");
    await updateDoc(userDoc, {
      gamesCreated: minusGame,
    });
 } catch (error) {
    throw error
 }   
}

export default deleteGame;