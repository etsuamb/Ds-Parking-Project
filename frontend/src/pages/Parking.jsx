import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parkingAPI } from '../api/parking';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Parking = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const data = await parkingAPI.getLots();
        setLots(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Failed to load parking lots');
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Parking Lots</h1>

        {lots.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-xl">No parking lots available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lots.map((lot) => {
              const availabilityPercent = lot.totalSpots
                ? ((lot.availableSpots || 0) / lot.totalSpots) * 100
                : 0;
              const isLowAvailability = availabilityPercent < 20;

              return (
                <Link
                  key={lot.id}
                  to={`/parking/${lot.id}`}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Lot {lot.id}</h2>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        isLowAvailability
                          ? 'bg-red-100 text-red-800'
                          : availabilityPercent < 50
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {availabilityPercent.toFixed(0)}% available
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Spots</span>
                      <span className="font-semibold text-gray-900">{lot.totalSpots || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Available</span>
                      <span className="font-semibold text-primary-600">
                        {lot.availableSpots || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Occupied</span>
                      <span className="font-semibold text-gray-900">
                        {(lot.totalSpots || 0) - (lot.availableSpots || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          isLowAvailability
                            ? 'bg-red-500'
                            : availabilityPercent < 50
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
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
    </div>
  );
};

export default Parking;

