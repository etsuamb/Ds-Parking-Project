import { createClient } from "redis";
import crypto from "crypto";

const client = createClient({
  url: "redis://host.docker.internal:6379"
});

client.connect();

export function publish(eventName, payload) {
  const event = {
    eventId: crypto.randomUUID(),
    eventType: eventName,
    occurredAt: new Date().toISOString(),
    payload
  };

  client.publish(eventName, JSON.stringify(event));
  console.log(`Published event: ${eventName} {id: ${event.eventId}}`);
}
