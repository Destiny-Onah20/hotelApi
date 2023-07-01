import * as admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PRO_ID,
  storageBucket: process.env.STORE_BUCK,
  messagingSenderId: process.env.MES_SEND_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASURE_ID
};

const cloudFirebaseApp = admin.initializeApp(firebaseConfig);

export default cloudFirebaseApp;