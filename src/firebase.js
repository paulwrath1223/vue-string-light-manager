import {colorCompile} from "@/colorCompiler&Dependencies";

import {getDatabase, onValue, ref, set} from "firebase/database";
import {app, globalUser, signIn} from "@/main.js";


function arduinoToJson(arduinoNotJSON)
{
    console.log("function arduinoToJson begun")
    let colorJSON = colorCompile(arduinoNotJSON);
    return({
        "Name": arduinoNotJSON.location,
        "colorLength": colorJSON.length,
        "colors": colorJSON,
        "mirrorIndex" : arduinoNotJSON.mirrorIndex, // doesnt exist yet in this branch
        "numLights" : arduinoNotJSON.numLights,
        "speed" : arduinoNotJSON.speed,
        "state" : arduinoNotJSON.state, // doesnt exist yet in this branch
        "update" : true // ALWAYS TRUE
    });

}



function delay(delayInMs)
{
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInMs);
    });
}

export function getCurrentUserName()
{
    return((globalUser.displayName).toString());
}

export function getCurrentUserImage()
{
    return((globalUser.photoURL).toString());
}

export async function uploadArduino(arduino)
{

    await verifyUser();
    while(globalUser === null)
    {
        await delay(10);
    }
    const id = arduino.currentID;
    const json = arduinoToJson(arduino);
    console.log("JSON to upload to id " + id + ": ");
    console.log(json);
    const db = getDatabase(app);
    return(set(ref(db, 'Arduinos/' + id + '/'), json));
}

export async function downloadArduino(id)
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
        "mirrorIndex" : 0,
        "idInputValue": 0,
        "state": true,
        "idInputVisible": false,
        "location": "Test from website",
        "colors":[]

    };

    await verifyUser();
    while(globalUser === null)
    {
        await delay(10);
    }


    arduinoOut.speed = await getAttribute(id, "speed");

    arduinoOut.numLights = await getAttribute(id, "numLights");

    arduinoOut.location = await getAttribute(id, "Name");

    return arduinoOut;

}

async function verifyUser()
{
    if(globalUser == null)
    {
        await signIn();
    }
    console.log("user: ");
    console.log(globalUser);
}

async function getAttribute(id, attribute)
{
    const db = getDatabase(app);

    const tempPath = ('Arduinos/' + id + '/' + attribute);
    const tempRef = ref(db, tempPath);
    onValue(tempRef, (snapshot) => {
        const tempResult = snapshot.val();
        console.log("get id " + id + "'s " + attribute+": " + tempResult);
        return tempResult;
    });
}