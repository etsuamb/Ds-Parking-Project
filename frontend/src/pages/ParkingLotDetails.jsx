import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { parkingAPI } from '../api/parking';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const ParkingLotDetails = () => {
  const { lotId } = useParams();
  const [lot, setLot] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchLotDetails = async () => {
      try {
        const data = await parkingAPI.getLotDetails(lotId);
        setLot(data);
        setSpots(Array.isArray(data.spots) ? data.spots : []);
      } catch (error) {
        toast.error('Failed to load parking lot details');
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-xl">Parking lot not found</p>
            <Link to="/parking" className="mt-4 text-primary-600 hover:text-primary-700">
              ← Back to Parking Lots
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const availableSpots = spots.filter((spot) => spot.status === 'available');
  const reservedSpots = spots.filter((spot) => spot.status === 'reserved');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/parking"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Parking Lots
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lot {lotId}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500">Total Spots</div>
              <div className="text-2xl font-semibold text-gray-900">{spots.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Available</div>
              <div className="text-2xl font-semibold text-green-600">{availableSpots.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Reserved</div>
              <div className="text-2xl font-semibold text-yellow-600">{reservedSpots.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Parking Spots</h2>

          {spots.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No spots in this lot</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {spots.map((spot) => (
                <div
                  key={spot.id}
                  className={`p-4 rounded-lg border-2 ${
                    spot.status === 'available'
                      ? 'border-green-500 bg-green-50'
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">Spot {spot.id}</div>
                    <div
                      className={`mt-2 text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                        spot.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {spot.status}
                    </div>
                    {isAuthenticated && spot.status === 'available' && (
                      <Link
                        to={`/bookings/new?lotId=${lotId}&spotId=${spot.id}`}
                        className="mt-2 block text-xs text-primary-600 hover:text-primary-700 font-medium"
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
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800">
              <Link to="/login" className="font-medium hover:underline">
                Sign in
              </Link>{' '}
              to book a parking spot
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLotDetails;

