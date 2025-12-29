import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bookingsAPI } from '../api/bookings';
import { parkingAPI } from '../api/parking';
import { useNotification } from '../hooks/useNotification';
import NotificationModal from '../components/NotificationModal';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateBooking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState(searchParams.get('lotId') || '');
  const [selectedSpotId, setSelectedSpotId] = useState(searchParams.get('spotId') || '');
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const data = await parkingAPI.getLots();
        setLots(Array.isArray(data) ? data : []);
      } catch (error) {
        showNotification('Failed to load parking lots', 'error');
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
        const availableSpots = (data.spots || []).filter((spot) => spot.status === 'available');
        setSpots(availableSpots);
        if (availableSpots.length === 0) {
          showNotification('No available spots in this lot', 'error');
        }
      } catch (error) {
        showNotification('Failed to load spots', 'error');
        setSpots([]);
      }
    };

    fetchSpots();
  }, [selectedLotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedLotId || !selectedSpotId) {
      showNotification('Please select a lot and spot', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const booking = await bookingsAPI.createBooking(selectedLotId, selectedSpotId);
      showNotification('Booking created successfully!', 'success', 2000);
      setTimeout(() => navigate(`/bookings/${booking.id || booking.bookingId}`), 2000);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to create booking', 'error');
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Booking</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="lotId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Parking Lot
              </label>
              <select
                id="lotId"
                value={selectedLotId}
                onChange={(e) => {
                  setSelectedLotId(e.target.value);
                  setSelectedSpotId('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                <label htmlFor="spotId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Parking Spot
                </label>
                {spots.length === 0 ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm">
                      No available spots in this lot. Please select another lot.
                    </p>
                  </div>
                ) : (
                  <select
                    id="spotId"
                    value={selectedSpotId}
                    onChange={(e) => setSelectedSpotId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedLotId || !selectedSpotId}
                className="flex-1 px-4 py-2 border border-transparent rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <LoadingSpinner size="sm" /> : 'Create Booking'}
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

