import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { bookingsAPI } from "../api/bookings";
import { useNotification } from "../hooks/useNotification";
import NotificationModal from "../components/NotificationModal";
import LoadingSpinner from "../components/LoadingSpinner";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { notification, showNotification, hideNotification } =
    useNotification();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingsAPI.getBooking(id);
        setBooking(data);
      } catch (error) {
        showNotification("Failed to load booking details", "error");
        setTimeout(() => navigate("/bookings"), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    setCancelling(true);
    setShowCancelModal(false);

    try {
      await bookingsAPI.cancelBooking(id);
      showNotification("Booking cancelled successfully", "success", 2000);
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to cancel booking",
        "error"
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="app-card rounded-lg p-12 text-center">
            <p className="text-muted text-xl">Booking not found</p>
            <Link to="/bookings" className="mt-4 link-accent hover:underline">
              ← Back to Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/bookings"
          className="link-accent hover:underline mb-4 inline-block"
        >
          ← Back to My Bookings
        </Link>

        <div className="app-card rounded-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-200">
              Booking Details
            </h1>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                booking.status === "active"
                  ? "bg-green-900/30 text-green-300 border-green-700"
                  : booking.status === "cancelled"
                  ? "bg-rose-900/30 text-rose-300 border-rose-700"
                  : "bg-yellow-900/30 text-yellow-300 border-yellow-700"
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-muted">Booking ID</div>
                <div className="mt-1 text-lg font-semibold text-gray-200">
                  {booking.id}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted">Status</div>
                <div className="mt-1 text-lg font-semibold text-gray-200 capitalize">
                  {booking.status}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted">
                  Parking Lot
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-200">
                  <Link
                    to={`/parking/${booking.lotId || booking.lot_id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Lot {booking.lotId || booking.lot_id}
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted">
                  Parking Spot
                </div>
                <div className="mt-1 text-lg font-semibold text-gray-200">
                  {booking.spotId || booking.spot_id
                    ? `Spot ${booking.spotId || booking.spot_id}`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted">Created At</div>
                <div className="mt-1 text-lg text-gray-200">
                  {booking.createdAt || booking.created_at
                    ? new Date(
                        booking.createdAt || booking.created_at
                      ).toLocaleString()
                    : "N/A"}
                </div>
              </div>
              {(booking.updatedAt || booking.updated_at) && (
                <div>
                  <div className="text-sm font-medium text-muted">
                    Last Updated
                  </div>
                  <div className="mt-1 text-lg text-gray-200">
                    {new Date(
                      booking.updatedAt || booking.updated_at
                    ).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {booking.status === "active" && (
              <div className="pt-6 border-t border-gray-700">
                <button
                  onClick={handleCancelClick}
                  disabled={cancelling}
                  className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? <LoadingSpinner size="sm" /> : "Cancel Booking"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="notification-surface rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-rose-900/30 rounded-full mb-4 border border-rose-700">
                <svg
                  className="w-6 h-6 text-rose-300"
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
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
          duration={notification.duration}
        />
      )}
    </div>
  );
};

export default BookingDetails;
