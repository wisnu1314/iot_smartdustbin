import * as mqtt from "mqtt";
const host = "broker.emqx.io";
const TCPport = "1883";
const WSport = "8083";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `ws://${host}:${WSport}/mqtt`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
});
export default client;
