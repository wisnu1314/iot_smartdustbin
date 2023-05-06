// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
import admin from "firebase-admin";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import key from "./key.json";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDACtiEZsMuJMr_Idvc0rUB_H55mTwnS6w",
  authDomain: "iot-smartdustbin-bintang.firebaseapp.com",
  projectId: "iot-smartdustbin-bintang",
  storageBucket: "iot-smartdustbin-bintang.appspot.com",
  messagingSenderId: "1019158385101",
  appId: "1:1019158385101:web:3c92ef88a14bb90c283484",
  measurementId: "G-57B6QQEVF4",
};

// Initialize Firebase

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: key.project_id,
      clientEmail: key.client_email,
      privateKey: key.private_key,
    }),
  });
}
export default admin;
