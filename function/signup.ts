import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

interface SignUpData {
    displayName: string;
    email: string;
    password: string;
    pushToken: any;
}

export const SignUpFunction = async ({
    displayName,
    email,
    password,
    pushToken
}: SignUpData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // Check if user exists and update their profile.
        if (userCredential.user) {
            await updateProfile(userCredential.user, {
                displayName,
            });
        }

        await setDoc(doc(db, "users", `${auth.currentUser?.uid}`), {
            id: `${auth.currentUser?.uid}`,
            displayName: displayName,
            email: email,
            level: "1",
            points: 0,
            gamesPlayed: 0,
            gamesCreated: 0,
            bio: "",
            position: "",
            friends: [],
            pushToken: pushToken,
        });
    } catch (error) {
        throw error;
    }
};