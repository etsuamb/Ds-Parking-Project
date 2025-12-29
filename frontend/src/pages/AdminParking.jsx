import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { adminAPI } from '../api/admin';
import { useNotification } from '../hooks/useNotification';
import NotificationModal from '../components/NotificationModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminParking = () => {
  const { isAdmin } = useAuth();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (!isAdmin) {
      showNotification('Access denied. Admin privileges required.', 'error');
      return;
    }

    const fetchLots = async () => {
      try {
        const data = await adminAPI.getAllParkingLots();
        setLots(Array.isArray(data) ? data : []);
      } catch (error) {
        showNotification('Failed to load parking lots', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, [isAdmin, showNotification]);

  if (!isAdmin) {
    return null;
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parking Lots Management</h1>
          <p className="mt-2 text-sm text-gray-600">View detailed statistics for all parking lots</p>
        </div>

        {lots.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-xl">No parking lots found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lots.map((lot) => {
              const totalSpots = Number(lot.total_spots) || 0;
              const reservedSpots = Number(lot.reserved_spots) || 0;
              const availableSpots = Number(lot.available_spots) || totalSpots - reservedSpots;
              const utilizationRate = totalSpots > 0 ? ((reservedSpots / totalSpots) * 100).toFixed(1) : 0;

              return (
                <div key={lot.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lot.name || `Lot ${lot.id}`}
                    </h3>
                    <span className="text-2xl">🅿️</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Spots</span>
                      <span className="text-sm font-semibold text-gray-900">{totalSpots}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Available</span>
                      <span className="text-sm font-semibold text-green-600">{availableSpots}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reserved</span>
                      <span className="text-sm font-semibold text-red-600">{reservedSpots}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Utilization</span>
                        <span className="text-sm font-semibold text-gray-900">{utilizationRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${utilizationRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
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

export default AdminParking;

