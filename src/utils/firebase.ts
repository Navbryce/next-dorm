import firebase from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";
import * as firebaseui from "firebaseui";
import 'firebaseui/dist/firebaseui.css'

const firebaseConfig = {
    apiKey: "AIzaSyDP4Gu_hVZ1xV-wlSahkz26qWeTRf9d5lM",
    authDomain: "next-dorm-d5c03.firebaseapp.com",
    projectId: "next-dorm-d5c03",
    storageBucket: "next-dorm-d5c03.appspot.com",
    messagingSenderId: "568698609471",
    appId: "1:568698609471:web:7c1f5e4ae06b6654c8bd8a",
    measurementId: "G-K1ZRG80JSF"
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const ui = new firebaseui.auth.AuthUI(firebase.auth());
