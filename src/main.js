import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'

import {createApp, getCurrentInstance} from 'vue'
import App from './App.vue'
import store from './store'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";







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
        });
        // .catch((error) => {
        //     // Handle Errors here.
        //     // const errorCode = error.code;
        //     // const errorMessage = error.message;
        //     // // The email of the user's account used.
        //     // const email = error.email;
        //     // // The AuthCredential type that was used.
        //     // const credential = GoogleAuthProvider.credentialFromError(error);
        //     // ...
        // });
}

function delay(delayInMs) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInMs);
    });
}


async function uploadArduino(id, json)
{

    await verifyUser()
    while(user === "[loading]")
    {
        await delay(10)
    }

    const db = getDatabase(app);
    return(set(ref(db, 'Arduino' + id + '/'), json));
}

async function downloadArduino(id)
{

    await verifyUser()
    while(user === "[loading]")
    {
        await delay(10)
    }


    const db = getDatabase(app);

    const tempPath = ('Arduino' + id);
    const nameRef = ref(db, tempPath);
    onValue(nameRef, (snapshot) => {
        const data = snapshot.toJSON();
        const str = JSON.stringify(data, null, 2); // spacing level = 2
        console.log("arduino: " + str);
        return data;
    });

}
console.log("user: " + user);

async function verifyUser()
{
    if(user == null)
    {
        await signIn();
    }
    console.log("user: " + user);
}

function Color(red,green,blue)
{
    this.red = red;
    this.green = green;
    this.blue = blue;
}

const red = new Color(255,0,0)
const green = new Color(0,255,0)
const blue = new Color(0,0,255);


testing();

createApp(App).use(store).mount('#app')

async function testing()
{
    console.log("uploadArduino:");
    console.log(await uploadArduino(0,
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

    await downloadArduino(0)
}


