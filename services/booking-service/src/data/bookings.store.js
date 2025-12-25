let bookings = [];
let nextId = 1;

export function createBooking(data) {
  const booking = {
    id: nextId++,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...data
  };
  bookings.push(booking);
  return booking;
}

export function getBookingById(id) {
  return bookings.find(b => b.id === id);
}

export function cancelBooking(id) {
  const booking = getBookingById(id);
  if (!booking) return null;
  booking.status = "cancelled";
  return booking;
}
