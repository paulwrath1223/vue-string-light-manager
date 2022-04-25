#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <Firebase_ESP_Client.h>
#include <Adafruit_NeoPixel.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <EEPROM.h>
#include <wifi_functions.cpp>
#include <firebase_stuff.cpp>

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

#define DEBUG false
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

#define localUID "661195AIH780"  

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
        if(DEBUG)
        {
          Serial.println("unmirrored");
        }
        for(int i=0; i<numPixelsReal; i++)  // For each pixel...
        {
            if(errorStatus)
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
              unMirroredIndex = (mirrorIndex - abs(numPastMirror));
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
