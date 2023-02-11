import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
    apiKey: Constants.manifest?.extra?.apiKey,
    authDomain: Constants.manifest?.extra?.authDomain,
    projectId: Constants.manifest?.extra?.projectId,
    storageBucket: Constants.manifest?.extra?.storageBucket,
    messagingSenderId: Constants.manifest?.extra?.messagingSenderId,
    appId: Constants.manifest?.extra?.appId,
    databaseURL: Constants.manifest?.extra?.databaseURL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
