// dataStore.ts
import { db } from "../firebaseConfig";
import { doc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { create } from "zustand";

export interface UserData {
    id: string;
    displayName: string;
    email: string;
    bio: string;
    gamesCreated: number;
    gamesPlayed: number;
    level: string;
    points: number;
    position: string;
    friends: Array<String>;
}

export interface PlaygroundData {
    id: string;
    name: string;
    playAddress: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    closeTime: string;
    openTime: string;
    mapURL: string;
    imageURL: string;
}

export interface GameData {
    playgroundId: string;
    name: string;
    imageURL: any;
    date: string | null;
    startTime: string;
    endTime: string;
    numberOfPlayers: number;
    additionalNotes: string;
    Intensity: string;
    id: string;
    creatorUserID: string;
    players: string[];
    intensity: string;
    playAddress: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    mapURL: any;
}

type Store = {
    user: UserData | null;
    playground: PlaygroundData | null;
    game: GameData | null;
    users: UserData[];
    playgrounds: PlaygroundData[];
    games: GameData[];
    subscribeUser: (userId: string) => void;
    subscribePlayground: (playgroundId: string) => void;
    subscribeGame: (gameId: string) => void;
    fetchUsers: () => Promise<void>;
    fetchPlaygrounds: () => Promise<void>;
    fetchGames: () => Promise<void>;
};

export const useStore = create<Store>((set) => ({
    user: null,
    playground: null,
    game: null,
    users: [],
    playgrounds: [],
    games: [],
    subscribeUser: (userId: string) => {
        const userRef = doc(db, "users", userId);
        onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                set({ user: { id: docSnap.id, ...docSnap.data() } as UserData });
            } else {
                console.log("No such document!");
            }
        });
    },
    subscribePlayground: (playgroundId: string) => {
        const playgroundRef = doc(db, "playground", playgroundId);
        onSnapshot(playgroundRef, (docSnap) => {
            if (docSnap.exists()) {
                set({
                    playground: { id: docSnap.id, ...docSnap.data() } as PlaygroundData,
                });
            } else {
                console.log("No such document!");
            }
        });
    },
    subscribeGame: (gameId: string) => {
        const gameRef = doc(db, "game", gameId);
        onSnapshot(gameRef, (docSnap) => {
            if (docSnap.exists()) {
                set({ game: { id: docSnap.id, ...docSnap.data() } as GameData });
            } else {
                console.log("No such document!");
            }
        });
    },
    fetchUsers: async () => {
        const users = await getCollection("users");
        set({ users: users.map((user) => user as UserData) });
    },
    fetchPlaygrounds: async () => {
        const playgrounds = await getCollection("playground");
        set({
            playgrounds: playgrounds.map(
                (playground) => playground as PlaygroundData
            ),
        });
    },
    fetchGames: async () => {
        const games = await getCollection("game");
        set({ games: games.map((game) => game as GameData) });
    },
}));

async function getCollection(collectionName: string) {
    const collectionRef = collection(db, collectionName);
    const collectionSnap = await getDocs(collectionRef);

    return collectionSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}