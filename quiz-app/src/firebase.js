import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC1CZZ-Ql-KlwK81Q3aKebCXf-VxSPH8xE",
    authDomain: "quiz-app-d78dc.firebaseapp.com",
    projectId: "quiz-app-d78dc",
    storageBucket: "quiz-app-d78dc.appspot.com",
    messagingSenderId: "785638103789",
    appId: "1:785638103789:web:6f2796240ff7b8403ccae4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);