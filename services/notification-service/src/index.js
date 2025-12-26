import { subscribe } from "./messaging/eventSubscriber.js";
import { handleSpotReserved } from "./handlers/spotReserved.handler.js";

subscribe("parking.spot.reserved", handleSpotReserved);
