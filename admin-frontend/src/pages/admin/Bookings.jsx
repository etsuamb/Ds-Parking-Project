import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { adminAuth } from "../../auth/adminAuth";
import Toast from "../../components/admin/Toast";
import ConfirmModal from "../../components/admin/ConfirmModal";

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await adminApi.get("/admin/bookings");
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch bookings");
      setToast({ message: "Failed to fetch bookings", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (bookingId) => {
    setCancelBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    setShowCancelModal(false);
    try {
      await adminApi.post(`/admin/bookings/${cancelBookingId}/cancel`);
      setBookings(bookings.filter((b) => b.id !== cancelBookingId));
      setToast({ message: "Booking cancelled successfully", type: "success" });
      setCancelBookingId(null);
    } catch (err) {
      setToast({
        message: err.response?.data?.error || "Failed to cancel booking",
        type: "error",
      });
    }
  };

  const handleBookingClick = (bookingId, status) => {
    const isCancelled = status === "cancelled" || status === "CANCELLED";
    const isPending = status === "pending" || status === "PENDING";

    // Only navigate to details for active bookings (not pending or cancelled)
    if (!isCancelled && !isPending) {
      navigate(`/admin/bookings/${bookingId}`);
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-600 hover:text-gray-900"
                title="Back to Dashboard"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <span className="text-xl font-bold text-gray-900">
                All Bookings
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {adminAuth.getUser()?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Bookings
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage all user bookings
              </p>
            </div>
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700">
                {error}
              </div>
            )}
            <ul className="divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <li className="px-4 py-5 text-center text-gray-500">
                  No bookings found
                </li>
              ) : (
                bookings.map((booking, idx) => {
                  const isCancelled =
                    booking.status === "cancelled" ||
                    booking.status === "CANCELLED";
                  const isPending =
                    booking.status === "pending" ||
                    booking.status === "PENDING";
                  const isClickable = !isCancelled && !isPending;

                  return (
                    <li
                      key={booking.id}
                      className={`px-4 py-4 sm:px-6 ${
                        isClickable ? "cursor-pointer hover:bg-gray-50" : ""
                      }`}
                      onClick={() =>
                        handleBookingClick(booking.id, booking.status)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p
                              className={`text-sm font-medium truncate ${
                                isClickable
                                  ? "text-indigo-600 hover:text-indigo-800"
                                  : "text-gray-900"
                              }`}
                            >
                              {idx + 1}. Booking #{booking.id}
                              {isClickable && (
                                <span className="ml-2 text-xs text-gray-400">
                                  (Click for details)
                                </span>
                              )}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isCancelled
                                  ? "bg-red-100 text-red-800"
                                  : isPending
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                User:{" "}
                                {booking.user?.email ||
                                  booking.user?.username ||
                                  `ID: ${booking.user_id}`}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                Lot: {booking.lot_id}
                              </p>
                              {booking.spot_id && (
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                  Spot: {booking.spot_id}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                {new Date(booking.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="ml-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelClick(booking.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelBookingId(null);
        }}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
      />
    </div>
  );
};

export default AdminBookings;
