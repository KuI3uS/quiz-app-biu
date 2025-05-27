import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1CZZ-Ql-KlwK81Q3aKebCXf-VxSPH8xE",
    authDomain: "quiz-app-d78dc.firebaseapp.com",
    projectId: "quiz-app-d78dc",
    storageBucket: "quiz-app-d78dc.firebasestorage.app",
    messagingSenderId: "785638103789",
    appId: "1:785638103789:web:6f2796240ff7b8403ccae4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();