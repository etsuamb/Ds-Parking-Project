import { createClient } from "redis";

const client = createClient({
  url: "redis://host.docker.internal:6379"
});

client.connect();

export async function publishEvent(eventName, payload) {
  const event = {
    eventName,
    payload,
    publishedAt: new Date().toISOString()
  };

  await client.publish(eventName, JSON.stringify(event));
  console.log(`Event published: ${eventName}`, payload);
}
