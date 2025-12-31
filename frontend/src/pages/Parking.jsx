import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { parkingAPI } from "../api/parking";
import { useNotification } from "../hooks/useNotification";
import NotificationModal from "../components/NotificationModal";
import LoadingSpinner from "../components/LoadingSpinner";

const Parking = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { notification, showNotification, hideNotification } =
    useNotification();

  const filteredLots = lots.filter((lot) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      lot.id.toString().includes(q) || `lot ${lot.id}`.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const data = await parkingAPI.getLots();
        setLots(Array.isArray(data) ? data : []);
      } catch (error) {
        showNotification("Failed to load parking lots", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-200 mb-8">Parking Lots</h1>

        {/* Search */}
        <div className="mb-6">
          <label htmlFor="search-lots" className="flex items-center text-sm font-semibold text-gray-300 mb-2">
            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Parking Lots
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search-lots"
              type="text"
              aria-label="Search parking lots"
              placeholder="Search by lot id..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-600 rounded-md bg-slate-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
          </div>
        </div>

        {lots.length === 0 ? (
          <div className="app-card rounded-lg p-12 text-center">
            <p className="text-muted text-xl">No parking lots available</p>
          </div>
        ) : filteredLots.length === 0 ? (
          <div className="app-card rounded-lg p-12 text-center">
            <p className="text-muted text-xl">
              No parking lots match your search
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLots.map((lot) => {
              const availabilityPercent = lot.totalSpots
                ? ((lot.availableSpots || 0) / lot.totalSpots) * 100
                : 0;
              const isLowAvailability = availabilityPercent < 20;

              return (
                <Link
                  key={lot.id}
                  to={`/parking/${lot.id}`}
                  className="app-card rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-200">
                      Lot {lot.id}
                    </h2>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                        isLowAvailability
                          ? "bg-red-900/30 text-red-300 border-red-700"
                          : availabilityPercent < 50
                          ? "bg-yellow-900/30 text-yellow-300 border-yellow-700"
                          : "bg-green-900/30 text-green-300 border-green-700"
                      }`}
                    >
                      {availabilityPercent.toFixed(0)}% available
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Total Spots</span>
                      <span className="font-semibold text-gray-200">
                        {lot.totalSpots || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Available</span>
                      <span className="font-semibold text-primary-600">
                        {lot.availableSpots || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted">Occupied</span>
                      <span className="font-semibold text-gray-200">
                        {(lot.totalSpots || 0) - (lot.availableSpots || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          isLowAvailability
                            ? "bg-red-500"
                            : availabilityPercent < 50
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${availabilityPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="text-primary-600 font-medium hover:text-primary-700">
                      View Details →
                    </span>
                  </div>
                </Link>
              );
            })}
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

export default Parking;
