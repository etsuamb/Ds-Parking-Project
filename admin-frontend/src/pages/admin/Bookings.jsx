import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import { adminAuth } from "../../auth/adminAuth";
import Toast from "../../components/admin/Toast";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Sidebar from "../../components/admin/Sidebar";

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


  if (loading) {
    return (
      <div className="min-h-screen dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <nav className="dark-navbar shadow-lg sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">All Bookings</h1>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-xs">
                      {adminAuth.getUser()?.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-200 hidden md:block">
                    {adminAuth.getUser()?.email || 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="p-6">
          {error && (
            <div className="mb-6 bg-red-900/20 border-l-4 border-red-500 text-red-300 px-4 py-3 rounded-r-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          
          <div className="dark-card rounded-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Booking Management</h2>
              <p className="mt-1 text-sm text-gray-400">View and manage all user bookings</p>
            </div>
            
            <div className="divide-y divide-slate-700">
              {bookings.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="mt-4 text-sm text-gray-400 font-medium">No bookings found</p>
                </div>
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
                    <div
                      key={booking.id}
                      className={`px-6 py-5 transition-all duration-300 rounded-lg ${
                        isClickable ? "cursor-pointer hover:bg-slate-800/50 hover:shadow-md hover:-translate-y-0.5" : ""
                      }`}
                      onClick={() =>
                        handleBookingClick(booking.id, booking.status)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex-shrink-0">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isCancelled ? 'bg-red-900/30 border border-red-700' : isPending ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-green-900/30 border border-green-700'
                              }`}>
                                <svg className={`w-5 h-5 ${
                                  isCancelled ? 'text-red-400' : isPending ? 'text-yellow-400' : 'text-green-400'
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-base font-semibold ${
                                isClickable ? "text-indigo-400 hover:text-indigo-300" : "text-white"
                              }`}>
                                Booking #{booking.id}
                                {isClickable && (
                                  <span className="ml-2 text-xs font-normal text-gray-500">
                                    Click to view details
                                  </span>
                                )}
                              </p>
                              <div className="mt-1 flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  isCancelled
                                    ? "bg-red-900/30 text-red-300 border border-red-700"
                                    : isPending
                                    ? "bg-yellow-900/30 text-yellow-300 border border-yellow-700"
                                    : "bg-green-900/30 text-green-300 border border-green-700"
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-13 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400 font-medium">User</p>
                              <p className="text-white mt-0.5">
                                {booking.user?.email ||
                                  booking.user?.username ||
                                  `ID: ${booking.user_id}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-medium">Location</p>
                              <p className="text-white mt-0.5">
                                Lot {booking.lot_id}
                                {booking.spot_id && ` • Spot ${booking.spot_id}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 font-medium">Created</p>
                              <p className="text-white mt-0.5">
                                {new Date(booking.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="ml-4 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelClick(booking.id)}
                              className="btn-danger text-sm px-4 py-2"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
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
