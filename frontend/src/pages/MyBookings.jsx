import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bookingsAPI } from "../api/bookings";
import { useNotification } from "../hooks/useNotification";
import NotificationModal from "../components/NotificationModal";
import LoadingSpinner from "../components/LoadingSpinner";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const { notification, showNotification, hideNotification } =
    useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsAPI.getMyBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        showNotification("Failed to load bookings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelClick = (id) => {
    setBookingToCancel(id);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    setCancellingId(bookingToCancel);
    setShowCancelModal(false);

    try {
      await bookingsAPI.cancelBooking(bookingToCancel);
      showNotification("Booking cancelled successfully", "success");

      // Update local state so the UI reflects the cancellation
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingToCancel || b.bookingId === bookingToCancel
            ? { ...b, status: "cancelled" }
            : b
        )
      );
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to cancel booking",
        "error"
      );
    } finally {
      setCancellingId(null);
      setBookingToCancel(null);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchId.trim()) {
      showNotification("Please enter a booking ID to search", "error");
      return;
    }

    // Navigate directly to booking details page
    navigate(`/bookings/${searchId.trim()}`);
  };

  const filteredBookings = bookings.filter((booking) =>
    searchId.trim()
      ? String(booking.id || booking.bookingId)
          .toLowerCase()
          .includes(searchId.trim().toLowerCase())
      : true
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-200">My Bookings</h1>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-end gap-2"
            >
              <div className="flex-1">
                <label htmlFor="search-booking" className="flex items-center text-sm font-semibold text-gray-300 mb-2">
                  <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Booking
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    id="search-booking"
                    type="text"
                    placeholder="Enter Booking ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-md bg-slate-700 text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all duration-200"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary px-6 py-3">
                Search
              </button>
            </form>

            <Link
              to="/bookings/new"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm text-center"
            >
              New Booking
            </Link>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="app-card rounded-lg p-12 text-center">
            {bookings.length === 0 ? (
              <>
                <p className="text-muted text-xl mb-4">
                  You have no bookings yet
                </p>
                <Link
                  to="/bookings/new"
                  className="link-accent hover:underline font-medium"
                >
                  Create your first booking →
                </Link>
              </>
            ) : (
              <p className="text-muted text-xl">
                No bookings match the search ID.
              </p>
            )}
          </div>
        ) : (
          <div className="app-card rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Lot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Spot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-gray-700">
                {filteredBookings.map((booking, idx) => (
                  <tr key={booking.id} className="hover:bg-slate-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {booking.lot_id || booking.lotId
                        ? `Lot ${booking.lot_id || booking.lotId}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {booking.spot_id || booking.spotId
                        ? `Spot ${booking.spot_id || booking.spotId}`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          booking.status === "active" ||
                          booking.status === "pending"
                            ? "bg-green-900/30 text-green-300 border-green-700"
                            : booking.status === "cancelled"
                            ? "bg-rose-900/30 text-rose-300 border-rose-700"
                            : "bg-yellow-900/30 text-yellow-300 border-yellow-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {booking.created_at || booking.createdAt
                        ? new Date(
                            booking.created_at || booking.createdAt
                          ).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="text-primary-600 hover:underline"
                      >
                        View
                      </Link>
                      {booking.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => handleCancelClick(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="text-rose-600 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === booking.id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          duration={notification.duration}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="notification-surface rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-200 text-center mb-2">
                Cancel Booking?
              </h3>
              <p className="text-sm text-muted text-center mb-6">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelModalClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-200 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
