#include <Adafruit_NeoPixel.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>

#include <addons/TokenHelper.h>

#include <addons/RTDBHelper.h>

#define WIFI_SSID "WIFI910"
#define WIFI_PASSWORD "1cadenas"



/* 3. Define the RTDB URL */
#define DATABASE_URL "https://light-data1-default-rtdb.firebaseio.com/" 
#define DATABASE_SECRET "xnsxVJEbZchsxN2XPCkxAPhlZXdvWBt318oq98jh"


//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long dataMillis = 0;

#define DEBUG false



String basePath = "users/2ia6lTHtEYhyiYbbXLMytXh1Cnc2/Arduinos/6/";


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

String path;
String speedPath;
String lightLengthPath;
String colorLengthPath;
String colorPath;
String updatePath;
String statePath;
String mirrorIndexPath;

int waveOffset = 0;

uint32_t colorList[150];
uint32_t currentColor;

void updateCloud(bool forceUpdate = false)
{
    if(DEBUG)
    {
      Serial.println("database query began");
    }      
    Firebase.getBool(fbdo, updatePath, &update);
    Firebase.getBool(fbdo, statePath, &state);
    if(update || forceUpdate)
    {
       

        Firebase.getFloat(fbdo, speedPath, &speed);
        lastNumColors = numColors;

        Firebase.getInt(fbdo, colorLengthPath, &numColors);

        Firebase.getInt(fbdo, mirrorIndexPath, &mirrorIndex);


        // numColors = Firebase.getInt(fbdo, colorLengthPath);

        Firebase.getInt(fbdo, lightLengthPath, &numPixelsReal);

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
          Firebase.getInt(fbdo, path+"r/", &r);
          if(DEBUG)
          {
            Serial.print("r: ");
            Serial.println(r);
          }
          Firebase.getInt(fbdo, path+"g/", &g);
          if(DEBUG)
          {
            Serial.print("g: ");
            Serial.println(g);
          }
          Firebase.getInt(fbdo, path+"b/", &b);
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


void setup()
{
  updatePath = basePath + "/update";
  speedPath = basePath + "/speed";
  lightLengthPath = basePath + "/numLights";
  colorLengthPath = basePath + "/colorLength";
  colorPath = basePath+"/colors/";
  statePath = basePath + "/state";
  mirrorIndexPath = basePath + "/mirrorIndex";

  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
  pixels.clear();
  pixels.show(); // Initialize all pixels to 'off'
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);


  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;
  config.signer.tokens.legacy_token = DATABASE_SECRET;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h

  Firebase.reconnectWiFi(true);

  Firebase.begin(&config, &auth);

  updateCloud(true);

  Serial.print("colorList: ");
  for(int co = 0; co < 10; co++)
  {
    Serial.println(colorList[co]);
  }
  Serial.println("Finished with setup");
}



void loop()
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
    if(mirrorIndex == 0)
    {
      Serial.println("unmirrored");
      for(int i=0; i<numPixelsReal; i++)  // For each pixel...
      {
          currentColor = colorList[((numColors + i + waveOffset) % numColors)];
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