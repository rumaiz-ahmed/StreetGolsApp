import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

interface SignInData {
    email: string;
    password: string;
}

export const SignInFunction = async ({ email, password }: SignInData) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential;
    } catch (error) {
        throw error;
    }
};