import { reserveSpot } from "../services/parking.service.js";

export async function handleBookingCreated(event) {
  const { bookingId, lotId, spotId } = event.payload;

  console.log("Received booking.created", event.payload);

  reserveSpot({ bookingId, lotId, spotId });
}
