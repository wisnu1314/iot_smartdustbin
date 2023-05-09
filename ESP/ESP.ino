#include <ArduinoJson.h>

#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "[Redacted]";
const char* password = "[Redacted]";
const char* mqtt_server = "192.168.0.56";
const char* broker = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);

#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];



#include <HX711_ADC.h>

//pins:
const int HX711_dout = 25; //mcu > HX711 dout pin
const int HX711_sck = 26; //mcu > HX711 sck pin

const int trigPin = 18;
const int echoPin = 5;

const int trigPin2 = 21;
const int echoPin2 = 19;

const int trigPin3 = 17;
const int echoPin3 = 16;

//HX711 constructor:
HX711_ADC LoadCell(HX711_dout, HX711_sck);

//define sound speed in cm/uS
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701

unsigned long t = 0;
long duration;
float distanceCm;

void setup_wifi() {
  delay(10);
  
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  if ((char)payload[0] == '[ ... ]') {
    
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");

    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.publish("outTopic", "hello world");
      client.subscribe("inTopic");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");

      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  LoadCell.begin();
  //LoadCell.setReverseOutput(); //uncomment to turn a negative output value to positive
  unsigned long stabilizingtime = 2000; // preciscion right after power-up can be improved by adding a few seconds of stabilizing time
  boolean _tare = true; //set this to false if you don't want tare to be performed in the next step
  LoadCell.start(stabilizingtime, _tare);
  if (LoadCell.getTareTimeoutFlag() || LoadCell.getSignalTimeoutFlag()) {
    Serial.println("Timeout, check MCU>HX711 wiring and pin designations");
    while (1);
  }
  else {
    LoadCell.setCalFactor(237.03); // user set calibration value (float), initial value 1.0 may be used for this sketch
    Serial.println("Startup is complete");
  }

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input

  pinMode(trigPin2, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin2, INPUT); // Sets the echoPin as an Input

  pinMode(trigPin3, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin3, INPUT); // Sets the echoPin as an Input
  setup_wifi();
  
  client.setServer(broker, 1883);
//  client.setCallback(callback);
}

int serialPrintInterval = 2000;

void loop() {
  static boolean newDataReady = 0;

  // check for new data/start next conversion:
  if (LoadCell.update()) newDataReady = true;

  // get smoothed value from the dataset:
  if (newDataReady) {
    if (millis() > t + serialPrintInterval) {
      float i = LoadCell.getData();
      Serial.print("Load_cell output val: ");
      Serial.println(i);
      
      newDataReady = 0;
      t = millis();

      // Clears the trigPin
      digitalWrite(trigPin, LOW);
      delayMicroseconds(2);
      // Sets the trigPin on HIGH state for 10 micro seconds
      digitalWrite(trigPin, HIGH);
      delayMicroseconds(10);
      digitalWrite(trigPin, LOW);
  
      // Reads the echoPin, returns the sound wave travel time in microseconds
      duration = pulseIn(echoPin, HIGH);
  
      // Calculate the distance
      distanceCm = duration * SOUND_SPEED/2;
  
      // Prints the distance in the Serial Monitor
      Serial.print("Distance Top (cm): ");
      Serial.println(distanceCm);

      delay(1000);
      // Clears the trigPin
      digitalWrite(trigPin2, LOW);
      delayMicroseconds(2);
      // Sets the trigPin on HIGH state for 10 micro seconds
      digitalWrite(trigPin2, HIGH);
      delayMicroseconds(10);
      digitalWrite(trigPin2, LOW);
  
      // Reads the echoPin, returns the sound wave travel time in microseconds
      duration = pulseIn(echoPin2, HIGH);
  
      // Calculate the distance
      distanceCm = duration * SOUND_SPEED/2;
  
      // Prints the distance in the Serial Monitor
      Serial.print("Distance Left (cm): ");
      Serial.println(distanceCm);



      delay(1000);
      // Clears the trigPin
      digitalWrite(trigPin3, LOW);
      delayMicroseconds(2);
      // Sets the trigPin on HIGH state for 10 micro seconds
      digitalWrite(trigPin3, HIGH);
      delayMicroseconds(10);
      digitalWrite(trigPin3, LOW);
  
      // Reads the echoPin, returns the sound wave travel time in microseconds
      duration = pulseIn(echoPin3, HIGH);
  
      // Calculate the distance
      distanceCm = duration * SOUND_SPEED/2;
  
      // Prints the distance in the Serial Monitor
      Serial.print("Distance Right (cm): ");
      Serial.println(distanceCm);
      Serial.print("\n");

      
//      StaticJsonBuffer<300> JSONbuffer;
//      JsonObject& JSONencoder = JSONbuffer.createObject();
//
//      JSONencoder["id"] = "dustbin_1";
//      JSONencoder["weight"] = i;
//      JSONencoder["distance"] = distanceCm;
//
//      char JSONmessageBuffer[100];
//      JSONencoder.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
      
//      snprintf (msg, MSG_BUFFER_SIZE, "", hours, minutes, seconds);
//      client.publish("outTopic", JSONmessageBuffer);
    }
  }
}
