import paho.mqtt.client as mqtt

MQTT_BROKER = "57.159.24.214"
MQTT_PORT = 1883
MQTT_TOPIC = "desktop/donnaMobileConnectRequest"

def on_connect(client, userdata, flags, reasonCode, properties=None):
    if reasonCode == 0:
        print("Connected to MQTT Broker!")
        client.subscribe(MQTT_TOPIC)
        client.subscribe("desktop/donnaMobileDisconnect")
        print(f"Subscribed to topic: {MQTT_TOPIC}")
    else:
        print(f"Failed to connect, return code {reasonCode}")

def on_message(client, userdata, msg):
    print(f"Received message on topic {msg.topic}: {msg.payload.decode()}")

if __name__ == "__main__":
    client = mqtt.Client(protocol=mqtt.MQTTv311)
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_forever()
