import { subscribe } from "./messaging/eventSubscriber.js";
import { handleBookingCreated } from "./events/bookingCreated.handler.js";

subscribe("booking.created", handleBookingCreated);
