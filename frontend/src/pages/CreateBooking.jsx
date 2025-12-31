import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bookingsAPI } from "../api/bookings";
import { parkingAPI } from "../api/parking";
import { useNotification } from "../hooks/useNotification";
import NotificationModal from "../components/NotificationModal";
import LoadingSpinner from "../components/LoadingSpinner";

const CreateBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState(
    searchParams.get("lotId") || ""
  );
  const [selectedSpotId, setSelectedSpotId] = useState(
    searchParams.get("spotId") || ""
  );
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { notification, showNotification, hideNotification } =
    useNotification();

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

  useEffect(() => {
    const fetchSpots = async () => {
      if (!selectedLotId) {
        setSpots([]);
        return;
      }

      try {
        const data = await parkingAPI.getLotDetails(selectedLotId);
        const availableSpots = (data.spots || []).filter(
          (spot) => spot.status === "available"
        );
        setSpots(availableSpots);
        if (availableSpots.length === 0) {
          showNotification("No available spots in this lot", "error");
        }
      } catch (error) {
        showNotification("Failed to load spots", "error");
        setSpots([]);
      }
    };

    fetchSpots();
  }, [selectedLotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLotId || !selectedSpotId) {
      showNotification("Please select a lot and spot", "error");
      return;
    }

    setSubmitting(true);

    try {
      const booking = await bookingsAPI.createBooking(
        selectedLotId,
        selectedSpotId
      );
      showNotification("Booking created successfully!", "success", 2000);
      setTimeout(
        () => navigate(`/bookings/${booking.id || booking.bookingId}`),
        2000
      );
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to create booking",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-200 mb-8">
          Create New Booking
        </h1>

        <div className="app-card rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="lotId"
                className="flex items-center text-sm font-semibold text-gray-300 mb-2"
              >
                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Select Parking Lot
              </label>
              <select
                id="lotId"
                value={selectedLotId}
                onChange={(e) => {
                  setSelectedLotId(e.target.value);
                  setSelectedSpotId("");
                }}
                className="w-full px-4 py-3 rounded-md bg-slate-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                required
              >
                <option value="">Choose a lot...</option>
                {lots.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    Lot {lot.id} ({lot.availableSpots || 0} available)
                  </option>
                ))}
              </select>
            </div>

            {selectedLotId && (
              <div>
                <label
                  htmlFor="spotId"
                  className="flex items-center text-sm font-semibold text-gray-300 mb-2"
                >
                  <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Select Parking Spot
                </label>
                {spots.length === 0 ? (
                  <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-md">
                    <p className="text-yellow-300 text-sm">
                      No available spots in this lot. Please select another lot.
                    </p>
                  </div>
                ) : (
                  <select
                    id="spotId"
                    value={selectedSpotId}
                    onChange={(e) => setSelectedSpotId(e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-slate-700 border border-gray-600 text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    required
                  >
                    <option value="">Choose a spot...</option>
                    {spots.map((spot) => (
                      <option key={spot.id} value={spot.id}>
                        {spot.spotNumber || `Spot ${spot.id}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedLotId || !selectedSpotId}
                className="flex-1 px-4 py-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <LoadingSpinner size="sm" /> : "Create Booking"}
              </button>
            </div>
          </form>
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

export default CreateBooking;
