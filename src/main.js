import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

import {createApp, getCurrentInstance} from 'vue'
import App from './App.vue'
import store from './store'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider, getIdToken, isSignInWithEmailLink } from "firebase/auth";







// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBvzbSDl_9Z58G4cXnaFJIuH1MT5uUOmkw",
    authDomain: "light-data1.firebaseapp.com",
    databaseURL: "https://light-data1-default-rtdb.firebaseio.com",
    projectId: "light-data1",
    storageBucket: "light-data1.appspot.com",
    messagingSenderId: "253519292577",
    appId: "1:253519292577:web:13dec18f6bb511ef4a68e0",
    measurementId: "G-R5NM0KT8LC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();


const auth = getAuth();
const user = auth.currentUser;
async function signIn() {
    await signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

function uploadArduino(id, json) {
    const db = getDatabase(app);
    return(set(ref(db, 'Arduino' + id + '/'), json));
}

function downloadArduino(id){
    const db = getDatabase(app);

    const tempPath = ('Arduino' + id + '/Name');
    const nameRef = ref(db, tempPath);
    onValue(nameRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
    });

}
console.log(auth.toString());

if(user == null)
{
    signIn();
}
stuff();

createApp(App).use(store).mount('#app')




function stuff()
{
    console.log("uploadArduino:");
    console.log(uploadArduino(0,
        {
            "Name" : "voj-ta sus icky",
            "colorLength" : 44,
            "colors" : [ {
                "b" : 128,
                "g" : 0,
                "r" : 255
            }, {
                "b" : 126,
                "g" : 2,
                "r" : 251
            }, {
                "b" : 128,
                "g" : 0,
                "r" : 255
            } ],
            "mirrorIndex" : 19,
            "numLights" : 100,
            "speed" : 0.2,
            "state" : true,
            "update" : false
        }));

    downloadArduino(0)
}


