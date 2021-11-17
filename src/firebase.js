import {colorCompile, JSONtoHex} from "@/colorCompiler&Dependencies";
import {getDatabase, onValue, ref, set, remove, off} from "firebase/database";
import {app, auth, globalUser, uid} from "@/main.js";



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
        "mirrorIndex" : arduinoNotJSON.waveMode ? ((arduinoNotJSON.mirrorIndex == null) ? 0 : arduinoNotJSON.mirrorIndex) : 0,
        "numLights" : arduinoNotJSON.lightsCount,
        "speed" : arduinoNotJSON.speed,
        "state" : arduinoNotJSON.enabled,
        "waveMode" : arduinoNotJSON.waveMode,
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
    console.log("flag 5");
    console.log("about to read length of " + keyFrameIndices);
    arduinoOut.colors = extractNodes(keyFrameIndices, rawColors);
    return arduinoOut;



}

function extractNodes(keyFrameIndices, rawColors)
{
    const rcl = rawColors.length;
    const keyFrameIndicesLength = keyFrameIndices.length;
    let colorNodes = [];
    const templateColor = {
        "color": "#000000",
        "transitionFrames": 1
    };
    let tempColor = templateColor;
    let currentNodeColor = {
        "r": 0,
        "g": 0,
        "b": 0
    };
    console.log("keyFrameIndicesLength: " + keyFrameIndicesLength);
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
    return(colorNodes);
}

function verifyUser()
{
    if(globalUser == null)
    {
        alert("you must be signed in to do that");
    }
}

async function getAttribute(path, absolute = false)
{
    await verifyUser();
    const db = getDatabase(app);
    let tempResult = undefined;
    let tempPath = ""
    if(absolute)
    {
        tempPath = (path);
    }
    else
    {
        tempPath = ("users/" + uid + path);
    }
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

function removeItemAll(arr, value)
{
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

export function getUID()
{
    return(uid);
}

export async function getOwnerOf(UID)
{
    await verifyUser();
    const uidPath = "arduinoUIDs/" + UID + "/associatedUID";
    return await getAttribute(uidPath, true);
}

export async function changeID(arduinoUID, newID)
{
    await verifyUser();
    const db = getDatabase(app);
    const uidPath = "arduinoUIDs/" + arduinoUID + "/userSpecificID";
    await set(ref(db, uidPath), newID);
}

export async function setArduinoOwner(arduinoUID, newOwnerUID)
{
    console.log("setArduinoOwner(" + arduinoUID + ", " + newOwnerUID + "): ");
    await verifyUser();
    const db = getDatabase(app);
    const uidPath = "arduinoUIDs/" + arduinoUID + "/associatedUID";
    console.log("setting path \"" + uidPath + "\" to " + newOwnerUID + "result: ");
    console.log(await set(ref(db, uidPath), newOwnerUID));
}

export async function getArduinoUserID(UID)
{
    await verifyUser();
    const uidPath = "arduinoUIDs/" + UID + "/userSpecificID";
    return await getAttribute(uidPath, true);
}
