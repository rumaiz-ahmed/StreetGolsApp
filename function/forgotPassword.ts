import { auth } from "../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

interface ForgotPasswordData {
    email: string;
}

export const ForgotPasswordFunction = async ({ email }: ForgotPasswordData) => {
    try {
        sendPasswordResetEmail(auth, email)
    } catch (error) {
        throw error;
    }
};