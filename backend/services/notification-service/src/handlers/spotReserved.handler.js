export function handleSpotReserved(event) {
  const { bookingId, lotId, spotId } = event.payload;

  console.log(
    `📧 Notification: Booking ${bookingId} confirmed. Spot ${spotId} reserved in lot ${lotId}.`
  );

  // Emit notification via socket.io if available
  if (global.io) {
    global.io.emit("notification", {
      type: "spot.reserved",
      message: `Spot ${spotId} reserved in lot ${lotId} for booking ${bookingId}`,
      data: {
        bookingId,
        lotId,
        spotId,
        timestamp: new Date().toISOString()
      }
    });
  }
}
