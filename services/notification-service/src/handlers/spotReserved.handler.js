export function handleSpotReserved(event) {
  const { bookingId, lotId, spotId } = event.payload;

  console.log(
    `📧 Notification: Booking ${bookingId} confirmed. Spot ${spotId} reserved in lot ${lotId}.`
  );
}
