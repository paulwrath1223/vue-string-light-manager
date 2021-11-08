import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'


import {createApp, getCurrentInstance} from 'vue'
import App from './App.vue'
import store from './store'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {colorNodesToRGBjson} from "@/colorCompiler&Dependencies";


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
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();


const auth = getAuth();
let user = null;
let credential;
let token;

async function signIn() {
    user = "[loading]";
    console.log("sign in function begin");
    return signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            credential = GoogleAuthProvider.credentialFromResult(result);
            token = credential.accessToken;
            // The signed-in user info.
            user = result.user;
            // ...
        }).catch((error) => {
            console.log("sign in error!");
            console.log(error.code);
            //     // Handle Errors here.
            //     // const errorCode = error.code;
            //     // const errorMessage = error.message;
            //     // // The email of the user's account used.
            //     // const email = error.email;
            //     // // The AuthCredential type that was used.
            //     // const credential = GoogleAuthProvider.credentialFromError(error);
            //     // ...
        });
}

function delay(delayInMs) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInMs);
    });
}

function getCurrentUserName()
{
    return((user.displayName).toString());
}

function getCurrentUserImage()
{
    return((user.photoURL).toString());
}


async function uploadArduino(arduino)
{
    console.log("line 1");
    const id = arduino.currentID;
    console.log("line 2");
    const json = arduinoToJson(arduino);
    console.log("line 3");
    await verifyUser();
    console.log("line 4");
    while(user === "[loading]")
    {
        await delay(10);
    }
    console.log("line 5");
    const db = getDatabase(app);
    console.log("line 6");
    return(set(ref(db, 'Arduino' + id + '/'), json));
}

async function downloadArduino(id)
{
    // speed: 0,
    // numLights: 0,
    // currentID: -1,
    // idInputValue: 0,
    // idInputVisible: false,
    // location: ""
    let arduinoOut = {
        "speed": 0,
        "numLights": 0,
        "currentID": id,
        "idInputValue": 0,
        "idInputVisible": false,
        "location": ""
    };

    await verifyUser();
    while(user === "[loading]")
    {
        await delay(10);
    }


    const db = getDatabase(app);

    const speedPath = ('Arduino' + id + '/speed');
    const speedRef = ref(db, speedPath);
    onValue(speedRef, (snapshot) => {
        const speedFromDB = snapshot.val();
        arduinoOut.speed = speedFromDB;
        console.log("speedFromDB: " + speedFromDB);
    });
    const numLightsPath = ('Arduino' + id + '/numLights');
    const numLightsRef = ref(db, numLightsPath);
    onValue(numLightsRef, (snapshot) => {
        const numLightsFromDB = snapshot.val();
        arduinoOut.numLights = numLightsFromDB;
        console.log("numLightsFromDB: " + numLightsFromDB);
    });
    const locationPath = ('Arduino' + id + '/Name');
    const locationRef = ref(db, locationPath);
    onValue(locationRef, (snapshot) => {
        const locationFromDB = snapshot.val();
        arduinoOut.location = locationFromDB;
        console.log("locationFromDB: " + locationFromDB);
    });


}

async function verifyUser()
{
    if(user == null)
    {
        await signIn();
    }
    console.log("user: ");
    console.log(user);
}

export async function testing()
{
    console.log("uploadArduino:");
    console.log(await uploadArduino(0,
        {
            //insert Vojta JSON Arduino format
        }));

    await downloadArduino(0);
    console.log("getCurrentUserName(): " + getCurrentUserName())
    console.log("getCurrentUserImage(): " + getCurrentUserImage())
}

function arduinoToJson(arduino)
{
    let colorJSON = colorNodesToRGBjson(arduino);
    return({
        "Name": arduino.location,
        "colorLength": colorJSON.length,
        "colors": colorJSON,
        "mirrorIndex" : arduino.mirrorIndex,
        "numLights" : arduino.numLights, // doesnt exist yet in this branch
        "speed" : arduino.speed,
        "state" : arduino.state, // doesnt exist yet in this branch
        "update" : true // ALWAYS TRUE
    });
}





createApp(App).use(store).mount('#app')

