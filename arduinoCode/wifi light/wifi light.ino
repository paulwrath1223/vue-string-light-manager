#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <WiFiClient.h>
#include <Firebase_ESP_Client.h>
#include <Adafruit_NeoPixel.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <EEPROM.h>


// //Comment to exclude Cloud Firestore
// #define ENABLE_FIRESTORE

// //Comment to exclude Firebase Cloud Messaging
// #define ENABLE_FCM

// //Comment to exclude Firebase Storage
// #define ENABLE_FB_STORAGE

// //Comment to exclude Cloud Storage
// #define ENABLE_GC_STORAGE

// //Comment to exclude Cloud Function for Firebase
// #define ENABLE_FB_FUNCTIONS



FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long dataMillis = 0;

#define DEBUG true
#define COLORDEBUG false
#define HEAPDEBUG false

//Variables
int i = 0;
int statusCode;
const char* ssid = "Wifi";
const char* passphrase = "password";
String st;
String content;
 
 //192.168.4.1
 
//Function Declaration
bool testWifi(void);
void launchWeb(void);
void setupAP(void);
void updateCloud(boolean);

#define localUID "sample6969"  

String UserUID = "";
int id = 0;

String basePath = "users/default/Arduinos/1/";


#define PIN 2


Adafruit_NeoPixel pixels(500, PIN, NEO_RGB + NEO_KHZ400);

float speed = 0; // 0 means solid color, 1 means wave.
int numPixelsReal = 500;
int r;
int g;
int b;
int numColors;
int updateCounter;
int lastNumColors;
int mirrorIndex;
int unMirroredIndex;
float timing = 0;
bool update = true;
bool state = true; // false means the lights are off
int numPastMirror;
int currentIndex;
bool waveMode = false;
int brightness;
int memcurr;
int memlast;
bool tempBool;
int errorStatus;

String path;
String tempPath;
String speedPath;
String lightLengthPath;
String colorLengthPath;
String colorPath;
String updatePath;
String statePath;
String mirrorIndexPath;
String waveModePath;
String brightnessPath;
String tempUUID;

int waveOffset = 0;

uint32_t colorList[300];
uint32_t currentColor;


#define USER_EMAIL "{revoked}"
#define USER_PASSWORD "{revoked}"


#define DATABASE_URL "{revoked}" 
#define DATABASE_SECRET "{revoked}"

 
//Establishing Local server at port 80 whenever required
ESP8266WebServer server(80);
 
void setup()
{
  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
  pixels.clear();
  pixels.show(); // Initialize all pixels to 'off'
  Serial.begin(115200); //Initialising if(DEBUG)Serial Monitor


  EEPROM.begin(512); //Initialising EEPROM
  resetWifi();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

    /** Assign the maximum retry of token generation */
  config.max_token_generation_retry = 20;

  Firebase.reconnectWiFi(true);

  Firebase.begin(&config, &auth);

  updatePaths();

  updateCloud(true);
 
}



void loop() {
  if(HEAPDEBUG)
  {
    memcurr = ESP.getFreeHeap();
    Serial.printf("FREEHeap: %d; DIFF %d\n", memcurr, memcurr - memlast);
    memlast = memcurr;
    // ESP.heap_caps_print_heap_info();
  }
  if ((WiFi.status() == WL_CONNECTED))
  {
 
    if(updateCounter > 10000)
    {
      updateCloud(false);
      checkDistress();
      updateCounter = 0;
    }
    //Flash string (PROGMEM and  (FPSTR), String,, String C/C++ string, const char, char array, string literal are supported
    //in all Firebase and FirebaseJson functions, unless F() macro is not supported
    delay(1); // might mess everything up
    timing -= speed;
    
    while(timing > 1)
    {
      timing -= 1;
      waveOffset += 1;    
    }

    while(timing < (-1))
    {
      timing += 1;
      waveOffset -= 1;    
    }

    // if( !(waveOffset < numColors && waveOffset > -numColors))  
    // {
    //   waveOffset = waveOffset % numColors;
    // }
    while(waveOffset <= (-numColors))
    {
      waveOffset += numColors;
    }
    while(waveOffset >= numColors)
    {
      waveOffset -= numColors;
    }

    if(state)
    {
      if(mirrorIndex == 0 || !waveMode)
      {
        if(COLORDEBUG)
        {
          Serial.println("unmirrored");
        }
        for(int i=0; i<numPixelsReal; i++)  // For each pixel...
        {
            currentColor = colorList[((numColors + (i * int(waveMode)) + waveOffset) % numColors)];
            pixels.setPixelColor(i, currentColor);
            if(COLORDEBUG)
            {
              Serial.print("setting pixel ");
              Serial.print(i);
              Serial.print(" to ");
              Serial.println(currentColor);
            }
        }
      }
      else // mirror point exists
      {
        if(COLORDEBUG)
        {
          Serial.println("mirrored");
        }
        for(int i = 0; i < numPixelsReal; i++)  
        {
            if(i < mirrorIndex)
            {
              currentIndex = ((numColors + i + waveOffset) % numColors);
              currentColor = colorList[currentIndex];
              pixels.setPixelColor(i, currentColor);
              if(COLORDEBUG)
              {
                Serial.print("setting unmirrored pixel ");
                Serial.print(i);
                Serial.print(" to currentColor[");
                Serial.println(currentIndex);
              }
            }
            else // current pixel is or is past the mirror index
            {
              numPastMirror = i-mirrorIndex;
              unMirroredIndex = (mirrorIndex - abs(numPastMirror));
              currentIndex = (unMirroredIndex + waveOffset);
              while(currentIndex < 0)
              {
                currentIndex += numColors;
              } 
              currentIndex = (currentIndex % numColors);
              currentColor = colorList[currentIndex];
              pixels.setPixelColor(i, currentColor);
              if(COLORDEBUG)
              {
                Serial.print("setting mirrored pixel ");
                Serial.print(i);
                Serial.print(" to currentColor[");
                Serial.print(currentIndex);
                Serial.print("]\n");
              }
            }
        }
      }
    }
    else
    {
      pixels.clear();
    }
    pixels.show();   // Send the updated pixel colors to the hardware.
    updateCounter++;
  
  }
  else
  {
    resetWifi();
  }
 
}






/*
                WIFI FUNCTIONS
*/


void resetWifi()
{
  Serial.println();
  Serial.println("Disconnecting previously connected WiFi");
  WiFi.disconnect();
  delay(10);
  Serial.println();
  Serial.println();
  Serial.println("Startup"); 
  //---------------------------------------- Read EEPROM for SSID and pass
  Serial.println("Reading EEPROM ssid");
 
  String esid;
  for (int i = 0; i < 32; ++i)
  {
    esid += char(EEPROM.read(i));
  }
  Serial.println();
  Serial.print("SSID: ");
  Serial.println(esid);
  Serial.println("Reading EEPROM pass");
  String epass = "";
  for (int i = 32; i < 96; ++i)
  {
    epass += char(EEPROM.read(i));
  }
  Serial.print("PASS: ");
  Serial.println(epass);
  WiFi.begin(esid.c_str(), epass.c_str());
  if (testWifi())
  {
    Serial.println("Succesfully Connected!!!");
  }
  else
  {
    Serial.println("Turning the HotSpot On");
    launchWeb();
    setupAP();// Setup HotSpot
  }
  Serial.println();
  Serial.println("Waiting.");
  
  while ((WiFi.status() != WL_CONNECTED))
  {
    Serial.print(".");
    delay(100);
    server.handleClient();
  }
}

void passCredentials(String targetSSID)
{
  if(DEBUG)
  {
    Serial.print("passCredentials to ");
    Serial.println(targetSSID);
  }
  String URL;
  WiFi.disconnect();  
  delay(10);

  //---------------------------------------- Read EEPROM for SSID and pass
  Serial.println("Reading EEPROM ssid");
 
  String esid;
  for (int i = 0; i < 32; ++i)
  {
    esid += char(EEPROM.read(i));
  }
  Serial.println();
  Serial.print("SSID: ");
  Serial.println(esid);
  Serial.println("Reading EEPROM pass");
  String epass = "";
  for (int i = 32; i < 96; ++i)
  {
    epass += char(EEPROM.read(i));
  }
  Serial.print("PASS: ");
  Serial.println(epass);
  WiFi.begin(targetSSID, "");
  URL = "/setting?ssid=";
  URL += esid.c_str();
  URL += "&pass=";
  URL += epass.c_str();
  while ((WiFi.status() != WL_CONNECTED))
  {
    Serial.print(".");
    delay(100);
    server.handleClient();
  }
  WiFiClient client;
  HTTPClient http;
  
  // Your Domain name with URL path or IP address with path
  http.begin(client, "192.168.4.1/");

  // Specify content-type header
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");
  // Data to send with HTTP POST
  if(DEBUG)
  {
    Serial.print("posting ");
    Serial.println(URL);
  }
  String httpRequestData = URL;           
  // Send HTTP POST request
  int httpResponseCode = http.POST(httpRequestData);
  if (httpResponseCode < 0) {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  
  // If you need an HTTP request with a content type: application/json, use the following:
  //http.addHeader("Content-Type", "application/json");
  //int httpResponseCode = http.POST("{\"api_key\":\"tPmAT5Ab3j7F9\",\"sensor\":\"BME280\",\"value1\":\"24.25\",\"value2\":\"49.54\",\"value3\":\"1005.14\"}");

  // If you need an HTTP request with a content type: text/plain
  //http.addHeader("Content-Type", "text/plain");
  //int httpResponseCode = http.POST("Hello, World!");
  if(DEBUG)
  {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  }
  
    
  // Free resources
  http.end();
  
  resetWifi();
}

void checkDistress()
{
  Serial.println("checking for nearby arduinos in \'distress\'");
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
    Serial.println("no networks found");
  else
  {

    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i)
    {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      const String currentSSID = WiFi.SSID(i);

      Serial.print(currentSSID);
      if(currentSSID.substring(0,19) == "WifiLightController")    //not too sure about ".split" in c++
      {
        const String currentUID = currentSSID.substring(20);
        tempPath = (String("arduinoUIDs/") + currentUID);
        tempPath += "/associatedUID";
        Firebase.RTDB.getString(&fbdo, tempPath);
        tempUUID = fbdo.stringData();
        tempUUID.replace("\"", "");
        if(tempUUID == UserUID)
        {
          passCredentials(currentSSID);
          return;
        }
      }
    }
  }
}

void createWebServer()
{
 {
    server.on("/", []() {
 
      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + String('.') + String(ip[1]) + String('.') + String(ip[2]) + String('.') + String(ip[3]);
      content = "<!DOCTYPE HTML>\r\n<html>Hello from ESP8266 at ";
      content += "<form action=\"/scan\" method=\"POST\"><input type=\"submit\" value=\"scan\"></form>";
      content += ipStr;
      content += "<p>";
      content += st;
      content += "</p><label> Arduino UID: ";
      content += localUID;
      content += "</label><form method='get' action='setting'><label>SSID: </label><input name='ssid' length=32><input name='pass' length=64><input type='submit'></form>";
      content += "</html>";
      server.send(200, "text/html", content);
    });
    server.on("/scan", []() {
      //setupAP();
      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + String('.') + String(ip[1]) + String('.') + String(ip[2]) + String('.') + String(ip[3]);
 
      content = "<!DOCTYPE HTML>\r\n<html>go back";
      server.send(200, "text/html", content);
    });
 
    server.on("/setting", []() {
      String qsid = server.arg("ssid");
      String qpass = server.arg("pass");
      if (qsid.length() > 0 && qpass.length() > 0) {
        Serial.println("clearing eeprom");
        for (int i = 0; i < 96; ++i) {
          EEPROM.write(i, 0);
        }
        Serial.println(qsid);
        Serial.println("");
        Serial.println(qpass);
        Serial.println("");
 
        Serial.println("writing eeprom ssid:");
        for (u_int i = 0; i < qsid.length(); ++i)
        {
          EEPROM.write(i, qsid[i]);
          Serial.print("Wrote: ");
          Serial.println(qsid[i]);
        }
        Serial.println("writing eeprom pass:");
        for (u_int i = 0; i < qpass.length(); ++i)
        {
          EEPROM.write(32 + i, qpass[i]);
          Serial.print("Wrote: ");
          Serial.println(qpass[i]);
        }
        EEPROM.commit();
 
        content = "{\"Success\":\"saved to eeprom... reset to boot into new wifi\"}";
        statusCode = 200;
        ESP.reset();
      } else {
        content = "{\"Error\":\"404 not found\"}";
        statusCode = 404;
        Serial.println("Sending 404");
      }
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.send(statusCode, "application/json", content);
 
    });
  } 
}

void setupAP(void)
{
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  int n = WiFi.scanNetworks();
  Serial.println("scan done");
  if (n == 0)
    Serial.println("no networks found");
  else
  {
    Serial.print(n);
    Serial.println(" networks found");
    for (int i = 0; i < n; ++i)
    {
      // Print SSID and RSSI for each network found
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*");
      delay(10);
    }
  }
  Serial.println("");
  st = "<ol>";
  for (int i = 0; i < n; ++i)
  {
    // Print SSID and RSSI for each network found
    st += "<li>";
    st += WiFi.SSID(i);
    st += " (";
    st += WiFi.RSSI(i);
 
    st += ")";
    st += (WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " " : "*";
    st += "</li>";
  }
  st += "</ol>";
  delay(100);
  WiFi.softAP(String("WifiLightController/") + localUID, "");
  Serial.println("softap");
  launchWeb();
  Serial.println("over");
}
 
//-------- Fuctions used for WiFi credentials saving and connecting to it which you do not need to change 
bool testWifi(void)
{
  int c = 0;
  Serial.println("Waiting for Wifi to connect");
  while ( c < 60 ) {
    if (WiFi.status() == WL_CONNECTED)
    {
      return true;
    }
    delay(500);
    Serial.print("*");
    c++;   //lmao
  }
  Serial.println("");
  Serial.println("Connect timed out, opening AP");
  return false;
}
 
void launchWeb()
{
  Serial.println("");
  if (WiFi.status() == WL_CONNECTED)
    Serial.println("WiFi connected");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());
  Serial.print("SoftAP IP: ");
  Serial.println(WiFi.softAPIP());
  createWebServer();
  // Start the server
  server.begin();
  Serial.println("Server started");
}

/*
                              FIREBASE FUNCTIONS
*/


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


/*

Possible solutions:
 -> I was facing this problem and it was fixed by changing Tools>Upload Speed to 115200.
    And Flash Size to 4M(3M SPIFFS).

 -> heap_caps_get_free_size(), heap_caps_print_heap_info()
    (see https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/system/heap_debug.html)

AFTER ~1HR OF EXECUTING: 
ets Jan 8 2013,rst cause:4, boot mode:(3,7)
wdt reset
load 0x4010f000, len 3460, room 16
tail 4
chksum 0xcc
load 0x3fff20b8, len 40, room 4
tail 4
chksum 0xc9c
sum 0xc9v0008a560
~ldDisconnecting

previously connected WiFi

StartupReading EEPROM ssidSSID: WIFI910
Reading EEPROM passPASS: {Password was correct}
Waiting for Wifi to connect********************
Connect timed out, opening AP
Turning the HotSpot On

Server started
scan done
13 networks found
1: WIFI910 (-72)*
2: Victorian Guest (-80)*
3: Eleven (-80)*
4: Victorian Guest (-78)*
5: Eleven (-78)*
6: HVP_b82ca0e88aed-Pairing (-85)*
7: Eleven (-86)*
8: Burt Household (-86)*
9: Grant School Car Pool (-80)*
10: Victorian Guest (-84)*
11: VALIS (-91)*
12: HOME-5812 (-88)*
13: WIFI910 (-68)*

softapLocal IP: (IP unset)
SoftAP IP: 192.168.4.1
Server startedover
Waiting.




comp notes:

In file included from c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src/wcs/esp8266/FB_TCP_Client.h:66,
                 from c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src/common.h:45,
                 from c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src/Utils.h:37,
                 from c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src\signer\Signer.h:37,
                 from c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src\signer\Signer.cpp:35:
c:\users\paulw\documents\arduino\libraries\firebase_arduino_client_library_for_esp8266_and_esp32\src\json\firebasejson.h: In member function 'size_t FirebaseJsonArray::iteratorBegin(const char*)':
c:\users\paulw\documents\arduino\libraries\firebase_arduino_client_library_for_esp8266_and_esp32\src\json\firebasejson.h:2510:38: warning: unused parameter 'data' [-Wunused-parameter]
 2510 |     size_t iteratorBegin(const char *data = NULL) { return mIteratorBegin(root); }
      |                                      ^
In file included from c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src\signer\Signer.h:37,
                 from c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src\signer\Signer.cpp:35:
c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src/Utils.h: In member function 'bool UtilsClass::waitIdle(int&)':
c:\Users\paulw\Documents\Arduino\libraries\Firebase_Arduino_Client_Library_for_ESP8266_and_ESP32\src/Utils.h:1849:24: warning: unused parameter 'httpCode' [-Wunused-parameter]
 1849 |     bool waitIdle(int &httpCode)
      |                   ~~~~~^~~~~~~~
*/
