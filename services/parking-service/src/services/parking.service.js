export function reserveSpot({ bookingId, lotId, spotId }) {
  console.log(
    `Reserving spot ${spotId || "AUTO"} in lot ${lotId} for booking ${bookingId}`
  );

  // later: publish parking.spot.reserved
}
