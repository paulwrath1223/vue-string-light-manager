import {colorCompile} from "@/colorCompiler&Dependencies";

import {getDatabase, onValue, ref, set} from "firebase/database";
import {app, globalUser, signIn} from "@/main.js";

// {
//         arduinoID: "1358",
//         speed: 0.7,
//         location: "Door Arch",
//         lightsCount: 100,
//         mirrorIndex: null,
//         enabled: true,
//         // updated: false,
//         colors: [
//             {color: "#FF0000", transitionFrames: 0},
//             {color: "#00FF00", transitionFrames: 1},
//             {color: "#0000FF", transitionFrames: 2},
//             {color: "#000000", transitionFrames: 3}
//         ]
// }



function arduinoToJson(arduinoNotJSON)
{
    console.log("function arduinoToJson begun")
    let colorJSON = colorCompile(arduinoNotJSON);
    return({
        "Name": arduinoNotJSON.location,
        "colorLength": colorJSON.length,
        "colors": colorJSON,
        "mirrorIndex" : arduinoNotJSON.mirrorIndex,
        "numLights" : arduinoNotJSON.lightsCount,
        "speed" : arduinoNotJSON.speed,
        "state" : arduinoNotJSON.enabled,
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

export async function uploadArduino(arduino) //WRITE KEYFRAMEINDICES DUMBASS
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

function JSONtoHex(currentNodeColor) {
    return "#000000";
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
        arduinoID: (id.toString()),
        speed: 0,
        location: "",
        lightsCount: 0,
        mirrorIndex: 0,
        enabled: true,
        colors: [
            {color: "#FF0000", transitionFrames: 1},
            {color: "#00FF00", transitionFrames: 2},
            {color: "#0000FF", transitionFrames: 3},
            {color: "#000000", transitionFrames: 4}
        ]
    };

    await verifyUser();
    while(globalUser === null)
    {
        await delay(10);
    }


    arduinoOut.speed = await getAttribute(id, "speed");
    arduinoOut.numLights = await getAttribute(id, "numLights");
    arduinoOut.location = await getAttribute(id, "Name");
    let rawColors = await getAttribute(id, "colors");
    let keyFrameIndices = await getAttribute(id, "keyFrameIndices");
    let colorNodes = {
        "colors":
            [

            ]

    };
    const templateColor = {
        "color": "#000000",
        "transitionFrames": 1
    };
    let tempColor = templateColor;
    // let currentNodeNumFrames = 0;
    let currentNodeColor = {
        "r": 0,
        "g": 0,
        "b": 0
    };
    for(
        let currentKeyFrameIndexIndex = 0;
        currentKeyFrameIndexIndex < keyFrameIndices.length;
        currentKeyFrameIndexIndex++
    )
    {
        const nextIndex = keyFrameIndices[(currentKeyFrameIndexIndex + 1) % keyFrameIndices.length]
        currentNodeColor = rawColors[keyFrameIndices[currentKeyFrameIndexIndex]];
        tempColor.transitionFrames = keyFrameIndices[currentKeyFrameIndexIndex] - nextIndex;
        tempColor = templateColor;
        tempColor.color = JSONtoHex(currentNodeColor);
        colorNodes.colors.push(tempColor);
    }
    arduinoOut.colors = colorNodes.colors; // restructure vard
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
