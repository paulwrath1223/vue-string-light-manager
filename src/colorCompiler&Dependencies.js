import {forEach} from "core-js/internals/array-iteration";


function getRed(colorObject)
{
    const hexColor = colorObject.color;
    return(parseInt((hexColor[1]+hexColor[2]), 16))
}
function getGreen(colorObject)
{
    const hexColor = colorObject.color;
    return(parseInt((hexColor[3]+hexColor[4]), 16))
}
function getBlue(colorObject)
{
    const hexColor = colorObject.color;
    return(parseInt((hexColor[5]+hexColor[6]), 16))
}
function buildHex(r, g, b)
{
    return(("#" + Number(r).toString(16) + Number(g).toString(16) + Number(b).toString(16)).toUpperCase());
}



function hexListToRGBJSON(hexList)
{
    let RGBjson = [];
    for(const hex of hexList)
    {
        RGBjson.push(hexColorToJson(hex));
    }
    return(RGBjson);
}

function hexColorToJson(hexString)
{
    return({
        "r": getRed(hexString),
        "g": getGreen(hexString),
        "b": getBlue(hexString)
    });
}



function colorCompile(arduinoIn)
{
    let colorsIn = arduinoIn.colors;
    let colorsOut = [];
    let CurrentColor; //string (hex color)
    let NextColor; //string (hex color)
    let dr; //float
    let dg; //float
    let db; //float
    let rs = [];
    let gs = [];
    let bs = [];
    for (let index = 0; index < colorsIn.length; index++)
    {
        if(index + 1 === colorsIn.length)
        {
            NextColor = colorsIn[0];
        }
        else
        {
            NextColor = colorsIn[index + 1];
        }
        CurrentColor = colorsIn[index];
        let CurrentTransitionFrames = CurrentColor.transitionFrames
        dr = (getRed(NextColor) - getRed(CurrentColor)) / (CurrentTransitionFrames - 1);
        dg = (getGreen(NextColor) - getGreen(CurrentColor)) / (CurrentTransitionFrames - 1);
        db = (getBlue(NextColor) - getBlue(CurrentColor)) / (CurrentTransitionFrames - 1);
        for (let index2 = 0; index2 < CurrentTransitionFrames; index2++)
        {
            rs.push(getRed(CurrentColor) + (index2 * dr));
            gs.push(getGreen(CurrentColor) + (index2 * dg));
            bs.push(getBlue(CurrentColor) + (index2 * db));
        }
    }
    for(let index3 = 0; index3 < rs.length; index3++)
    {
        colorsOut.push(buildHex(rs[index3], gs[index3], bs[index3]));
    }
    console.log("colorsOut: ");
    console.log(colorsOut);
    return colorsOut;
}

export function colorNodesToRGBjson(arduinoIn)
{
    let hexList = colorCompile(arduinoIn);
    return(hexListToRGBJSON(hexList));
}