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

    function extractKeyFrameIndices(arduinoNotJSON) {
        let generatedKeyFrameIndices = []
        let currentIndex = 0;
        for(const colorNode of arduinoNotJSON.colors)
        {
            generatedKeyFrameIndices.push(currentIndex);
            currentIndex += colorNode.transitionFrames;
        }
        return generatedKeyFrameIndices;
    }
    console.log("function arduinoToJson begun")
    let colorJSON = colorCompile(arduinoNotJSON);



    return({
        "Name": arduinoNotJSON.location,
        "colorLength": colorJSON.length,
        "colors": colorJSON,
        "keyFrameIndices": extractKeyFrameIndices(arduinoNotJSON),
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
    const id = arduino.arduinoID;
    const json = arduinoToJson(arduino);
    console.log("JSON to upload to id " + id + ": ");
    console.log(json);
    const db = getDatabase(app);
    return(set(ref(db, 'Arduinos/' + id + '/'), json));

}


function componentToHex(c) {
    const hex = Number(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function JSONtoHex(currentNodeColor) {
    console.log("JSONtoHex: ");
    console.log(currentNodeColor);

    const r = currentNodeColor.r;
    const g = currentNodeColor.g;
    const b = currentNodeColor.b;
    const result = ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b));
    console.log(result);
    return result;
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
    console.log("flag 1");
    await verifyUser();
    while(globalUser === null)
    {
        await delay(10);
    }

    console.log("flag 2");
    arduinoOut.speed = await getAttribute(id, "speed");
    arduinoOut.numLights = await getAttribute(id, "numLights");
    arduinoOut.location = await getAttribute(id, "Name");
    console.log("flag 3");
    let rawColors = await getAttribute(id, "colors");
    console.log("getting keyframe indices: ");
    let keyFrameIndices = await getAttribute(id, "keyFrameIndices"); //NOT ACTUALLY WAITING
    console.log(keyFrameIndices);
    let colorNodes = [];
    console.log("flag 4");
    const templateColor = {
        "color": "#000000",
        "transitionFrames": 1
    };
    let tempColor = templateColor;
    // let currentNodeNumFrames = 0;
    console.log("flag 5");
    let currentNodeColor = {
        "r": 0,
        "g": 0,
        "b": 0
    };
    console.log("about to read length of " + keyFrameIndices);
    const keyFrameIndicesLength = keyFrameIndices.length;
    console.log("keyFrameIndicesLength: " + keyFrameIndicesLength);
    const rcl = rawColors.length;
    for(
        let currentKeyFrameIndexIndex = 0;
        currentKeyFrameIndexIndex < keyFrameIndicesLength;
        currentKeyFrameIndexIndex++
    )
    {
        let nextIndex = rcl;
        if((currentKeyFrameIndexIndex + 1) !== keyFrameIndicesLength)
        {
            nextIndex = keyFrameIndices[currentKeyFrameIndexIndex + 1];
        }
        currentNodeColor = rawColors[keyFrameIndices[currentKeyFrameIndexIndex]];
        tempColor = templateColor;
        tempColor.transitionFrames = nextIndex - keyFrameIndices[currentKeyFrameIndexIndex];
        tempColor.color = JSONtoHex(currentNodeColor);
        console.log("tempColor: ");
        console.log(tempColor);
        const finalNode = tempColor; //  WHY DOES COLOR NODES CONTAIN 4 INSTANCES OF THE LAST NODE?????
        console.log("finalNode: ");
        console.log(finalNode);
        colorNodes.push({"index": currentKeyFrameIndexIndex,
            "node": finalNode}); // INDEX WORKS FINE !!!!!!!!!!!!!
    }
    console.log("colorNodes: ");
    console.log(colorNodes);
    arduinoOut.colors = colorNodes;
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

async function getAttribute(id, attribute) {
    const db = getDatabase(app);
    let tempResult = undefined;
    const tempPath = ('Arduinos/' + id + '/' + attribute);
    const tempRef = ref(db, tempPath);
    console.log("get id " + id + "'s " + attribute);
    onValue(tempRef, (snapshot) => {
        tempResult = snapshot.val();
        console.log("get id " + id + "'s " + attribute + ": " + tempResult);

    });
    while(tempResult === undefined)
    {
        await delay(10);
    }
    return tempResult;
}
