import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { parkingAPI } from "../api/parking";
import { useNotification } from "../hooks/useNotification";
import NotificationModal from "../components/NotificationModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

const ParkingLotDetails = () => {
  const { lotId } = useParams();
  const [lot, setLot] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { notification, showNotification, hideNotification } =
    useNotification();

  useEffect(() => {
    const fetchLotDetails = async () => {
      try {
        const data = await parkingAPI.getLotDetails(lotId);
        setLot(data);
        setSpots(Array.isArray(data.spots) ? data.spots : []);
      } catch (error) {
        showNotification("Failed to load parking lot details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchLotDetails();
  }, [lotId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="app-card rounded-lg p-12 text-center">
            <p className="text-muted text-xl">Parking lot not found</p>
            <Link to="/parking" className="mt-4 link-accent hover:underline">
              ← Back to Parking Lots
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const availableSpots = spots.filter((spot) => spot.status === "available");
  const reservedSpots = spots.filter((spot) => spot.status === "reserved");

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/parking"
          className="link-accent hover:underline mb-4 inline-block"
        >
          ← Back to Parking Lots
        </Link>

        <div className="app-card rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">Lot {lotId}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted">Total Spots</div>
              <div className="text-2xl font-semibold">{spots.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted">Available</div>
              <div className="text-2xl font-semibold text-success">
                {availableSpots.length}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted">Reserved</div>
              <div className="text-2xl font-semibold text-yellow-400">
                {reservedSpots.length}
              </div>
            </div>
          </div>
        </div>

        <div className="app-card rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Parking Spots</h2>

          {spots.length === 0 ? (
            <p className="text-muted text-center py-8">No spots in this lot</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    spot.status === "available"
                      ? "border-green-700 bg-green-900/20 hover:bg-green-900/30 hover:border-green-600"
                      : "border-yellow-700 bg-yellow-900/20 hover:bg-yellow-900/30 hover:border-yellow-600"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-200">
                      {spot.spotNumber || `Spot ${spot.id}`}
                    </div>
                    <div
                      className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full inline-block border ${
                        spot.status === "available"
                          ? "bg-green-900/30 text-green-300 border-green-700"
                          : "bg-yellow-900/30 text-yellow-300 border-yellow-700"
                      }`}
                    >
                      {spot.status}
                    </div>
                    {isAuthenticated && spot.status === "available" && (
                      <Link
                        to={`/bookings/new?lotId=${lotId}&spotId=${spot.id}`}
                        className="mt-2 block text-xs link-accent hover:underline font-medium"
                      >
                        Book Now
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!isAuthenticated && (
          <div className="mt-8 app-card rounded-lg p-4 text-center">
            <p className="text-muted">
              <Link
                to="/login"
                className="font-medium link-accent hover:underline"
              >
                Sign in
              </Link>{" "}
              to book a parking spot
            </p>
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
    </div>
  );
};

export default ParkingLotDetails;
