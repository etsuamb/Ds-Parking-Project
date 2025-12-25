import {
  createBooking,
  getBookingById,
  cancelBooking
} from "../data/bookings.store.js";
import { publishEvent } from "../messaging/eventPublisher.js";


export async function createBookingHandler(req, res) {
  const { lotId, spotId, userId } = req.body;

  if (!lotId || !userId) {
    return res.status(400).json({ error: "lotId and userId are required" });
  }

  const booking = createBooking({ lotId, spotId, userId });

  // 🔔 Publish event
  await publishEvent("booking.created", {
    bookingId: booking.id,
    userId,
    lotId,
    spotId,
    timestamp: booking.createdAt,
    status: booking.status
  });

  res.status(201).json(booking);
}


export function getBookingHandler(req, res) {
  const booking = getBookingById(Number(req.params.id));
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json(booking);
}

export function cancelBookingHandler(req, res) {
  const booking = cancelBooking(Number(req.params.id));
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json(booking);
}
