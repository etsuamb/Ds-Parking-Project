import { createClient } from "redis";

const client = createClient({
  url: "redis://redis:6379",  // or your working URL
});

client.connect();

// Add error handling (recommended)
client.on("error", (err) => console.error("Redis Publisher Error:", err));

// This is the function you need to export
export async function publishEvent(eventName, payload) {
  const event = {
    eventId: crypto.randomUUID(),
    eventType: eventName,
    occurredAt: new Date().toISOString(),
    payload
  };

  await client.publish(eventName, JSON.stringify(event));
  console.log(`Published event: ${eventName} (id: ${event.eventId})`);
}