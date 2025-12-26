import { publish } from "../messaging/eventPublisher.js";

export function reserveSpot({ bookingId, lotId, spotId }) { 
  const reservedSpotId = spotId || Math.floor(Math.random() * 100) + 1;

  console.log(
    `Spot ${reservedSpotId} reserved for booking ${bookingId}`
  );

  publish("parking.spot.reserved", {
    bookingId,
    lotId,
    spotId: reservedSpotId,
    timestamp: new Date().toISOString(),
    status: "reserved"
  });
}
