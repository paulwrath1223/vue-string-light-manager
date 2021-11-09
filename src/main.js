import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'


import {createApp, getCurrentInstance} from 'vue'
import App from './App.vue'
import store from './store'


import { initializeApp } from 'firebase/app';

import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

import {downloadArduino, getCurrentUserImage, getCurrentUserName, uploadArduino} from "@/firebase";


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBvzbSDl_9Z58G4cXnaFJIuH1MT5uUOmkw",
    authDomain: "light-data1.firebaseapp.com",
    databaseURL: "https://light-data1-default-rtdb.firebaseio.com",
    projectId: "light-data1",
    storageBucket: "light-data1.appoint.com",
    messagingSenderId: "253519292577",
    appId: "1:253519292577:web:13dec18f6bb511ef4a68e0",
    measurementId: "G-R5NM0KT8LC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export const auth = getAuth();
export let globalUser = null;

export async function signIn()
{
    // user = null;
    console.log("sign in function begin");

    globalUser = null;
    return signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
            // const user = result.user;
            globalUser = result.user;

            // ...
        }).catch((error) => {
            console.log("sign in error!");
            console.log("error code: " + error.code);
            //     // Handle Errors here.
            console.log("error Message: " + error.message);
            //     // const errorMessage = error.message;
            //     // // The email of the user's account used.
            console.log("The email of the user's account used: " + error.email);
            //     // const email = error.email;
            console.log("The AuthCredential type that was used: " + GoogleAuthProvider.credentialFromError(error));
            //     // // The AuthCredential type that was used.
            //     // const credential = GoogleAuthProvider.credentialFromError(error);
            //     // ...
        });

}

export async function testing()
{
    console.log("uploadArduino start:");
    const uploadResults = await uploadArduino(
        {
                arduinoID: "10",
                speed: 0,
                location: "web test with updated vard",
                lightsCount: 100,
                mirrorIndex: 50,
                enabled: true,
                // updated: false,
                colors: [
                {color: "#FF0000", transitionFrames: 3},
                {color: "#00FF00", transitionFrames: 3},
                {color: "#0000FF", transitionFrames: 2},
                {color: "#000000", transitionFrames: 3}
            ]
        });
    console.log("uploadResults: ");
    console.log(uploadResults);

    console.log(await downloadArduino(10));
    console.log("getCurrentUserName(): " + getCurrentUserName())
    console.log("getCurrentUserImage(): " + getCurrentUserImage())
}





createApp(App).use(store).mount('#app')

