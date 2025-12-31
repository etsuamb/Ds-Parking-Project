import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingsAPI } from "../api/bookings";
import { parkingAPI } from "../api/parking";
import { useNotification } from "../hooks/useNotification";
import NotificationModal from "../components/NotificationModal";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notification, showNotification, hideNotification } =
    useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, lotsData] = await Promise.all([
          bookingsAPI.getMyBookings(),
          parkingAPI.getLots(),
        ]);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setLots(Array.isArray(lotsData) ? lotsData : []);
      } catch (error) {
        showNotification("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");

  // Calculate total and available spots from real database data
  const totalSpots = lots.reduce((sum, lot) => {
    const total = Number(lot.totalSpots) || Number(lot.total_spots) || 0;
    return sum + total;
  }, 0);

  const availableSpots = lots.reduce((sum, lot) => {
    const available =
      Number(lot.availableSpots) ||
      Number(lot.available_spots) ||
      Number(lot.available) ||
      0;
    return sum + available;
  }, 0);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="app-card rounded-lg p-6">
            <div className="text-sm font-medium text-muted">
              Active Bookings
            </div>
            <div className="mt-2 text-3xl font-semibold">
              {activeBookings.length}
            </div>
          </div>
          <div className="app-card rounded-lg p-6">
            <div className="text-sm font-medium text-muted">Total Bookings</div>
            <div className="mt-2 text-3xl font-semibold">{bookings.length}</div>
          </div>
          <div className="app-card rounded-lg p-6">
            <div className="text-sm font-medium text-muted">Total Spots</div>
            <div className="mt-2 text-3xl font-semibold">{totalSpots}</div>
          </div>
          <div className="app-card rounded-lg p-6">
            <div className="text-sm font-medium text-muted">
              Available Spots
            </div>
            <div className="mt-2 text-3xl font-semibold text-primary-600">
              {availableSpots}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="app-card rounded-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Bookings</h2>
                <Link
                  to="/bookings"
                  className="text-sm link-accent hover:underline"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {activeBookings.length === 0 ? (
                <p className="text-muted text-center py-4">
                  No active bookings
                </p>
              ) : (
                <div className="space-y-4">
                  {activeBookings.slice(0, 5).map((booking) => (
                    <Link
                      key={booking.id}
                      to={`/bookings/${booking.id}`}
                      className="block p-4 border border-gray-700 rounded-lg hover:bg-slate-800 hover:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            Lot {booking.lotId || booking.lot_id} - Spot{" "}
                            {booking.spotId || booking.spot_id || "N/A"}
                          </div>
                          <div className="text-sm text-muted">
                            {booking.createdAt || booking.created_at
                              ? new Date(
                                  booking.createdAt || booking.created_at
                                ).toLocaleString()
                              : "N/A"}
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-900/30 text-green-300 border border-green-700">
                          {booking.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="app-card rounded-lg">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Parking Lots</h2>
                <Link
                  to="/parking"
                  className="text-sm link-accent hover:underline"
                >
                  Browse all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {lots.length === 0 ? (
                <p className="text-muted text-center py-4">
                  No parking lots available
                </p>
              ) : (
                <div className="space-y-4">
                  {lots.map((lot) => (
                    <Link
                      key={lot.id}
                      to={`/parking/${lot.id}`}
                      className="block p-4 border border-gray-700 rounded-lg hover:bg-slate-800 hover:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Lot {lot.id}</div>
                          <div className="text-sm text-muted">
                            {lot.availableSpots || 0} / {lot.totalSpots || 0}{" "}
                            spots available
                          </div>
                        </div>
                        <div className="text-primary-600">→</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/bookings/new" className="btn-primary">
            Create New Booking
          </Link>
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

export default Dashboard;
