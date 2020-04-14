import * as firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
	// Project Settings => Add Firebase to your web app
    apiKey: "AIzaSyCjtrgCKde_sTEN-I_7z9Rp8oUhKRNT-cc",
    authDomain: "notifications-13351.firebaseapp.com",
    databaseURL: "https://notifications-13351.firebaseio.com",
    projectId: "notifications-13351",
    storageBucket: "notifications-13351.appspot.com",
    messagingSenderId: "581287295658",
    appId: "1:581287295658:web:72441cb92ca6eadf6a6ed3",
    measurementId: "G-JZWNQETHRW"
});
const messaging = initializedFirebaseApp.messaging();
messaging.usePublicVapidKey(
	// Project Settings => Cloud Messaging => Web Push certificates
  "BIMvuTKcu_GUoyOA_yjC_pcVnOpPTmia3capBZkWBCmjy26We9CSzVGfK4ksIMHBge6uItjwknMPf5AF1iK3O0Y"
);
export { messaging };