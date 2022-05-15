import firebase from "firebase/compat/app";
import { isSupported, getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDP4Gu_hVZ1xV-wlSahkz26qWeTRf9d5lM",
  authDomain: "next-dorm-d5c03.firebaseapp.com",
  projectId: "next-dorm-d5c03",
  storageBucket: "next-dorm-d5c03.appspot.com",
  messagingSenderId: "568698609471",
  appId: "1:568698609471:web:7c1f5e4ae06b6654c8bd8a",
  measurementId: "G-K1ZRG80JSF",
};

const app = firebase.initializeApp(firebaseConfig);
export const analytics: Promise<Analytics | null> = (async () => {
  return (await isSupported()) ? getAnalytics(app) : null;
})();
