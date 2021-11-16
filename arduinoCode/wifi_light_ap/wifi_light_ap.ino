#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <Firebase_ESP_Client.h>
#include <Adafruit_NeoPixel.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
 

FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long dataMillis = 0;

#define DEBUG true

//Variables
int i = 0;
int statusCode;
const char* ssid = "Wifi";
const char* passphrase = "password";
String st;
String content;
 
 //192.168.4.1
 
//Function Decalration
bool testWifi(void);
void launchWeb(void);
void setupAP(void);
void updateCloud(boolean);

#define localUID 661195780

String UserUID = "";
int id = 0;

String basePath = "users/default/Arduinos/1/";


#define PIN 2


Adafruit_NeoPixel pixels(500, PIN, NEO_RGB + NEO_KHZ400);

float speed = 0; // 0 means solic color, 1 means wave.
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

int waveOffset = 0;

uint32_t colorList[150];
uint32_t currentColor;


#define USER_EMAIL "firebase.manage.arduino@gmail.com"
#define USER_PASSWORD "VjhYHg&yU7hIbjhBvhVt"


#define DATABASE_URL "https://light-data1-default-rtdb.firebaseio.com/" 
#define DATABASE_SECRET "xnsxVJEbZchsxN2XPCkxAPhlZXdvWBt318oq98jh"

 
//Establishing Local server at port 80 whenever required
ESP8266WebServer server(80);
 
void setup()
{

  updatePath = basePath + "/update";
  speedPath = basePath + "/speed";
  lightLengthPath = basePath + "/numLights";
  colorLengthPath = basePath + "/colorLength";
  colorPath = basePath+"/colors/";
  statePath = basePath + "/state";
  mirrorIndexPath = basePath + "/mirrorIndex";
  waveModePath = basePath + "/waveMode";
 

  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
  pixels.clear();
  pixels.show(); // Initialize all pixels to 'off'
  Serial.begin(115200); //Initialising if(DEBUG)Serial Monitor

  Serial.println();
  Serial.println("Disconnecting previously connected WiFi");
  WiFi.disconnect();
  EEPROM.begin(512); //Initialising EEPROM
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
  if ((WiFi.status() == WL_CONNECTED))
  {
 
    if(updateCounter > 10000)
    {
      updateCloud(false);
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

    if( !(waveOffset < numColors && waveOffset > -numColors))  
    {
      waveOffset = 0;
    }
    if(state)
    {
      if(mirrorIndex == 0 || !waveMode)
      {
        Serial.println("unmirrored");
        for(int i=0; i<numPixelsReal; i++)  // For each pixel...
        {
            currentColor = colorList[((numColors + (i * int(waveMode)) + waveOffset) % numColors)];
            pixels.setPixelColor(i, currentColor);
            if(DEBUG)
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
        Serial.println("mirrored");
        for(int i = 0; i < numPixelsReal; i++)  
        {
            if(i < mirrorIndex)
            {
              currentIndex = ((numColors + i + waveOffset) % numColors);
              currentColor = colorList[currentIndex];
              pixels.setPixelColor(i, currentColor);
              if(DEBUG)
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
              unMirroredIndex = (mirrorIndex-abs(numPastMirror));
              currentIndex = (unMirroredIndex + waveOffset);
              while(currentIndex < 0)
              {
                currentIndex += numColors;
              } 
              currentIndex = (currentIndex % numColors);
              currentColor = colorList[currentIndex];
              pixels.setPixelColor(i, currentColor);
              if(DEBUG)
              {
                Serial.print("setting mirrored pixel ");
                Serial.print(i);
                Serial.print(" to currentColor[");
                Serial.println(currentIndex);
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
    // reconnect
  }
 
}
 
 
//-------- Fuctions used for WiFi credentials saving and connecting to it which you do not need to change 
bool testWifi(void)
{
  int c = 0;
  Serial.println("Waiting for Wifi to connect");
  while ( c < 20 ) {
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
  WiFi.softAP("WifiLightController" + localUID, "");
  Serial.println("softap");
  launchWeb();
  Serial.println("over");
}
 
void createWebServer()
{
 {
    server.on("/", []() {
 
      IPAddress ip = WiFi.softAPIP();
      String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
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
      String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
 
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
        for (int i = 0; i < qsid.length(); ++i)
        {
          EEPROM.write(i, qsid[i]);
          Serial.print("Wrote: ");
          Serial.println(qsid[i]);
        }
        Serial.println("writing eeprom pass:");
        for (int i = 0; i < qpass.length(); ++i)
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

void updateCloud(bool forceUpdate = false)
{
    if(DEBUG)
    {
      Serial.println("database query began");
    }      
    update = Firebase.RTDB.getBool(&fbdo, updatePath) ? fbdo.to<bool>() : false;
    state = Firebase.RTDB.getBool(&fbdo, statePath) ? fbdo.to<bool>() : false;    
    if(update || forceUpdate)
    {

        waveMode = Firebase.RTDB.getBool(&fbdo, waveModePath) ? fbdo.to<bool>() : false;

        speed = Firebase.RTDB.getFloat(&fbdo, speedPath) ? fbdo.to<float>() : 0;
        
        lastNumColors = numColors;

        numColors = Firebase.RTDB.getInt(&fbdo, colorLengthPath) ? fbdo.to<int>() : 1;

        mirrorIndex = Firebase.RTDB.getInt(&fbdo, mirrorIndexPath) ? fbdo.to<int>() : 0;


        // numColors = Firebase.getInt(fbdo, colorLengthPath);

        numPixelsReal = Firebase.RTDB.getInt(&fbdo, lightLengthPath) ? fbdo.to<int>() : 1;

        // numPixelsReal = Firebase.getInt(fbdo, lightLengthPath);
        pixels.updateLength(numPixelsReal);

        pixels.clear();
        pixels.show(); // Initialize all pixels to 'off'
        if(DEBUG)
        {
          Serial.print("begining color query: ");
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
          r = Firebase.RTDB.getInt(&fbdo, path+"r/") ? fbdo.to<int>() : 0;

          if(DEBUG)
          {
            Serial.print("r: ");
            Serial.println(r);
          }
          g = Firebase.RTDB.getInt(&fbdo, path+"g/") ? fbdo.to<int>() : 0;

          if(DEBUG)
          {
            Serial.print("g: ");
            Serial.println(g);
          }
          b = Firebase.RTDB.getInt(&fbdo, path+"b/") ? fbdo.to<int>() : 0;

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
        Firebase.setInt(fbdo, updatePath, false);
//         update = Firebase.RTDB.getBool(&fbdo, updatePath) ? fbdo.to<bool>() : false;

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
  tempPath = ("arduinoUIDs/" + localUID);
  tempPath += "/associatedUID";
  if(!(Firebase.RTDB.getString(&fbdo, tempPath)))    //, &UserUID
//   update = Firebase.RTDB.getBool(&fbdo, tempPath) ? fbdo.to<bool>() : false;
  {
    Firebase.RTDB.setString(&fbdo, tempPath, "unclaimed");
  }
  UserUID = Firebase.RTDB.getString(&fbdo, tempPath) ? fbdo.to<string>() : "unclaimed";
  while(UserUID.equals("unclaimed"))
    {
      delay(20000);
      UserUID = Firebase.RTDB.getString(&fbdo, tempPath) ? fbdo.to<string>() : "unclaimed";

    }
  tempPath = ("arduinoUIDs/" + localUID);
  tempPath += "/userSpecificID";

  id = Firebase.RTDB.getInt(&fbdo, tempPath) ? fbdo.to<int>() : false;
  
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
  return;
}
