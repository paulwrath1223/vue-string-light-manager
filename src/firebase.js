import {colorCompile, JSONtoHex} from "@/colorCompiler&Dependencies";
import {getDatabase, onValue, ref, set, remove, off} from "firebase/database";
import {app, auth, globalUser, uid} from "@/main.js";



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
        "mirrorIndex" : (arduinoNotJSON.mirrorIndex == null) ? 0 : arduinoNotJSON.mirrorIndex,
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
    try{
        return (globalUser.displayName).toString();
    } catch(error)
    {
        return null;
    }
}

export function getCurrentUserImage()
{
    try{
        return (globalUser.photoURL).toString();
    } catch(error)
    {
        return null;
    }
}

export async function uploadArduino(arduino)
{



    await verifyUser();
    while(globalUser === null)
    {
        await delay(10);
    }
    const db = getDatabase(app);
    const id = arduino.arduinoID;
    console.log("uploading id " + id);
    let displayName = await getAttribute("/displayName")


    console.log("displayName: ");
    console.log(displayName);
    if(displayName == null)
    {
        console.log("Case: first-time upload ");
        console.log(await set(ref(db, "users/" + uid + "/usedIds"), [id]));
        console.log("usedIds from db: ");
        console.log(await getAttribute("/usedIds"));

    }
    else
    {
        let idList = await getAttribute("/usedIds");
        if(idList == null)
        {
            idList = [];
        }
        if(!(idList.includes(id)))
        {
            console.log("Case: idList != null, does not contain id ");
            idList.push(Number(id));
            await set(ref(db, "users/" + uid + "/usedIds"), idList);
        }
    }
    const json = arduinoToJson(arduino);
    console.log("JSON to upload to id " + id + ": ");
    console.log(json);
    await set(ref(db, "users/" + uid + "/displayName"), getCurrentUserName());
    await set(ref(db, "users/" + uid + "/email"), auth.currentUser.email);
    return(set(ref(db, "users/" + uid + '/Arduinos/' + id + '/'), json));

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
        arduinoID: id,
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
    arduinoOut.mirrorIndex = await getAttribute("/Arduinos/" + id + "/mirrorIndex");
    arduinoOut.speed = await getAttribute("/Arduinos/" + id + "/speed");
    arduinoOut.lightsCount = await getAttribute("/Arduinos/" + id + "/numLights");
    arduinoOut.location = await getAttribute("/Arduinos/" + id + "/Name");
    arduinoOut.enabled = await getAttribute("/Arduinos/" + id + "/state");
    console.log("flag 3");
    let rawColors = await getAttribute("/Arduinos/" + id + "/colors");
    console.log("getting keyframe indices: ");
    let keyFrameIndices = await getAttribute("/Arduinos/" + id + "/keyFrameIndices");
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
        const finalNode = JSON.parse(JSON.stringify(tempColor));
        console.log("finalNode: ");
        console.log(finalNode);
        colorNodes.push(finalNode);
    }
    console.log("colorNodes: ");
    console.log(colorNodes);
    arduinoOut.colors = colorNodes;
    return arduinoOut;

}


function verifyUser()
{
    if(globalUser == null)
    {
        alert("you must be signed in to do that");
    }
}



async function getAttribute(path) {
    await verifyUser();
    const db = getDatabase(app);
    let tempResult = undefined;
    const tempPath = ("users/" + uid + path);
    const tempRef = ref(db, tempPath);
    onValue(tempRef, (snapshot) => {
        tempResult = snapshot.val();
        console.log("get " + tempPath + ": " + tempResult);
    });
    while(tempResult === undefined)
    {
        await delay(10);
    }
    off(tempRef);
    return tempResult;
}

export async function downloadAllArds()
{
    await verifyUser();
    console.log("function: download all arduinos");
    let idList = await getAttribute("/usedIds");
    if(idList === null)
    {
        console.log("idList is empty, probably first-time user");
        idList = [];
    }
    let vardList = [];
    let currentVard;
    if(idList) {
        for (let id of idList) {
            try {
                currentVard = await downloadArduino(id);
            } catch {
                currentVard = undefined;
            }
            const vard = JSON.parse(JSON.stringify(currentVard));
            console.log("final vard: ");
            console.log(vard);
            vardList.push(vard);
        }
    }
    return vardList;
}

function removeItemAll(arr, value) {
    console.log("function: removeItemAll\nRemoving " + value + "from:");
    console.log(arr);
    let newArr = [];
    for(let i = 0;i < arr.length; i++) {
        if ((arr[i]) != (value)) { // DO NOT REPLACE WITH "!=="
            newArr.push(arr[i]);
        }
    }
    console.log("function: removeItemAll\nRemoved " + value + "from:");
    console.log(newArr);
    return newArr;
}


export async function deleteArduino(id)
{
    await verifyUser();
    const db = getDatabase(app);
    const tempPath = ("users/" + uid + "/Arduinos/" + id);
    const tempRef = ref(db, tempPath);
    let idList = await getAttribute("/usedIds");
    const newIdList = removeItemAll(idList, id);
    await set(ref(db, "users/" + uid + "/usedIds"), newIdList);
    return await remove(tempRef);
}

// export function getExistingIds()
// {
//     return(getAttribute("/usedIds"));
// }
//
export function getUID()
{
    return(uid);
}
