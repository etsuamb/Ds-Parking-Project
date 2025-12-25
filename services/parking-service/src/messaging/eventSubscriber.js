import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:6379"
});

client.connect();

export function subscribe(eventName, handler) {
  client.subscribe(eventName, (message) => {
    const event = JSON.parse(message);
    handler(event);
  });

  console.log(`Subscribed to ${eventName}`);
}
