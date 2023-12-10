import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const addFriend = async (userId: any, friendId: any) => {
    // Logic to add friendId to the user's friends list in the backend
    try {
        const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, {
        friends: arrayUnion(friendId),
    });
    } catch (error) {
        throw error
    }
  };
  
  const removeFriend = async (userId: any, friendId: any) => {
    // Logic to remove friendId from the user's friends list in the backend
    try {
        const gameDoc = doc(db, "users", userId);
        // delete the player from the player array
        await updateDoc(gameDoc, {
            friends: arrayRemove(friendId),
        });
        
    } catch (error) {
        throw error
    }
  
  };

  export {removeFriend, addFriend}