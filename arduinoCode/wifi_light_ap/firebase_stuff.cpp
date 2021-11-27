
void updateCloud(bool forceUpdate = false)
{
    checkDistress();
    if(DEBUG)
    {
      Serial.println("database query began");
    }      
    update = Firebase.RTDB.getBool(&fbdo, updatePath) ? fbdo.boolData() : false;
    state = Firebase.RTDB.getBool(&fbdo, statePath) ? fbdo.boolData() : false;    
    if(update || forceUpdate)
    {

        waveMode = Firebase.RTDB.getBool(&fbdo, waveModePath) ? fbdo.boolData() : false;

        speed = Firebase.RTDB.getFloat(&fbdo, speedPath) ? fbdo.floatData() : 0;

        brightness = Firebase.RTDB.getInt(&fbdo, brightnessPath) ? fbdo.intData() : 255;
        
        lastNumColors = numColors;

        numColors = Firebase.RTDB.getInt(&fbdo, colorLengthPath) ? fbdo.intData() : 1;

        mirrorIndex = Firebase.RTDB.getInt(&fbdo, mirrorIndexPath) ? fbdo.intData() : 0;


        // numColors = Firebase.getInt(fbdo, colorLengthPath);

        numPixelsReal = Firebase.RTDB.getInt(&fbdo, lightLengthPath) ? fbdo.intData() : 1;

        pixels.clear();
        pixels.show(); // Initialize all pixels to 'off'

  
        if(numPixelsReal != pixels.numPixels())
        {
          pixels.updateLength(numPixelsReal);              // (No) longer used to avoid memory leaks
        }
        if(pixels.getBrightness() != brightness)
        {
          pixels.setBrightness(constrain(brightness, 0, 255));
        }

        pixels.clear();
        pixels.show(); // Initialize all pixels to 'off'
        if(DEBUG)
        {
          Serial.print("beginning color query: ");
          Serial.print("numColors: ");
          Serial.println(numColors);
        }
        for(int counter = 0; counter<numColors; counter++)
        {
          path = colorPath + String(counter) + "/";
          if(DEBUG)
          {
            Serial.print("path: ");
            Serial.println(path);
          }
          r = Firebase.RTDB.getInt(&fbdo, path+"r/") ? fbdo.intData() : 0;

          if(DEBUG)
          {
            Serial.print("r: ");
            Serial.println(r);
          }
          g = Firebase.RTDB.getInt(&fbdo, path+"g/") ? fbdo.intData() : 0;

          if(DEBUG)
          {
            Serial.print("g: ");
            Serial.println(g);
          }
          b = Firebase.RTDB.getInt(&fbdo, path+"b/") ? fbdo.intData() : 0;

          if(DEBUG)
          {
            Serial.print("b: ");
            Serial.println(b);
          }
          // r = Firebase.getInt(fbdo, path+"r/");
          // g = Firebase.getInt(fbdo, path+"g/");
          // b = Firebase.getInt(fbdo, path+"b/");
          colorList[counter] = pixels.Color(r, g, b);
        }
        Firebase.RTDB.setBool(&fbdo, updatePath, false);
//           update = Firebase.RTDB.getBool(&fbdo, updatePath) ? fbdo.to<bool>() : false;

    }
    if(DEBUG)
    {
      Serial.println("database query done :");
      Serial.print("speed: ");
      Serial.println(speed);
      Serial.print("numColors: ");
      Serial.println(numColors);
      Serial.print("numPixelsReal: ");
      Serial.println(numPixelsReal);
      Serial.print("numPixels according to library: ");
      Serial.println(pixels.numPixels());
      Serial.print("mirrorIndex: ");
      Serial.println(mirrorIndex);
    }

}

void updatePaths()
{
  if(DEBUG)
  {
    Serial.println("function: update paths");
  }
  tempPath = (String("arduinoUIDs/") + localUID);
  tempPath += "/associatedUID";
  Firebase.RTDB.getString(&fbdo, tempPath);
  tempUUID = fbdo.stringData();
  tempUUID.replace("\"", "");
  if(DEBUG)
  {
    Serial.println("UUID from bd: " + tempUUID);
  }
  if(tempUUID.equals("null"))    //, &UserUID
  {
    if(DEBUG)
    {
      Serial.println("no uid in database");
    }
    Firebase.RTDB.setString(&fbdo, tempPath, String("unclaimed"));
    tempUUID = "unclaimed";
  }
  UserUID = tempUUID;
  while(UserUID.equals("unclaimed"))
    {
      delay(200);
      tempBool = Firebase.RTDB.getString(&fbdo, tempPath);
      tempUUID = fbdo.stringData();
      tempUUID.replace("\"", "");
      UserUID = tempBool ? tempUUID : "unclaimed";
      // consider adding "wait for claim" light animation

    }
  tempPath = (String("arduinoUIDs/") + localUID);
  tempPath += "/userSpecificID";

  id = Firebase.RTDB.getInt(&fbdo, tempPath) ? fbdo.intData() : -1;
  
  basePath = "users/" + UserUID;
  basePath += "/Arduinos/";
  basePath += id;
  updatePath = basePath + "/update";
  speedPath = basePath + "/speed";
  lightLengthPath = basePath + "/numLights";
  colorLengthPath = basePath + "/colorLength";
  colorPath = basePath+"/colors/";
  statePath = basePath + "/state";
  mirrorIndexPath = basePath + "/mirrorIndex";
  waveModePath = basePath + "/waveMode";
  brightnessPath = basePath + "/brightness";
  if(DEBUG)
  {
    Serial.println("\n update paths result: \n");
    Serial.print("basePath: ");
    Serial.println(basePath);
  }
  return;
}


void setStatusLights(int errorStatus)
{
  if(errorStatus == 0) //"no errors"
  {
    
  }
  else if(errorStatus == 1) //"not connected to database"
  {

  }
  else if(errorStatus == 2) // "reading colors from database"
  {

  }
  else if(errorStatus == 3)  // "unclaimed"
  {
    
  }

}

