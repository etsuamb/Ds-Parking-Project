import { useEffect, useState } from "react";
import { bookingsAPI } from "../api/bookings";
import { useNotification } from "../hooks/useNotification";
import NotificationModal from "../components/NotificationModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const { notification, showNotification, hideNotification } =
    useNotification();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // Decode JWT to get user info (simple base64 decode)
          try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserInfo({
              userId: payload.userId,
              username: payload.username,
              email: payload.email,
              role: payload.role,
            });
          } catch (e) {
            console.error("Error decoding token:", e);
          }
        }

        const bookingsData = await bookingsAPI.getMyBookings();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        showNotification("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-200 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="app-card rounded-lg p-6">
              <div className="text-center">
                <div className="mx-auto h-20 w-20 rounded-full avatar flex items-center justify-center mb-4">
                  <span className="text-2xl font-semibold">
                    {(userInfo?.username || "U").slice(0, 1)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-200">
                  {userInfo?.username || "User"}
                </h2>
                <p className="text-muted mt-2">
                  {userInfo?.email || "No email"}
                </p>
                <p className="text-sm text-muted mt-1">
                  User ID: {userInfo?.userId || "N/A"}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted">Total Bookings</span>
                    <span className="font-semibold text-gray-200">
                      {bookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Active Bookings</span>
                    <span className="font-semibold text-success">
                      {activeBookings.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Cancelled</span>
                    <span className="font-semibold text-rose-400">
                      {cancelledBookings.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="lg:col-span-2">
            <div className="app-card rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-200 mb-6">
                Booking History
              </h2>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted text-lg">No bookings yet</p>
                  <button
                    onClick={() => navigate("/bookings/new")}
                    className="mt-4 btn-primary"
                  >
                    Create Your First Booking
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="border border-gray-700 rounded-lg p-4 hover:bg-slate-800 hover:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-200">
                            Lot {booking.lot_id} - Spot{" "}
                            {booking.spot_id || "N/A"}
                          </div>
                          <div className="text-sm text-muted mt-1">
                            Created:{" "}
                            {new Date(booking.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full border ${
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
                          <button
                            onClick={() => navigate(`/bookings/${booking.id}`)}
                            className="link-accent hover:underline text-sm font-medium"
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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

export default Profile;
