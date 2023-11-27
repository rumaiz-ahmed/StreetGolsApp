import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export const SignOut = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};