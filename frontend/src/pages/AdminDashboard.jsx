import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminAPI } from '../api/admin';
import { bookingsAPI } from '../api/bookings';
import { parkingAPI } from '../api/parking';
import { useNotification } from '../hooks/useNotification';
import NotificationModal from '../components/NotificationModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    cancelledBookings: 0,
    totalLots: 0,
    totalSpots: 0,
    availableSpots: 0,
  });
  const [loading, setLoading] = useState(true);
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (!isAdmin) {
      showNotification('Access denied. Admin privileges required.', 'error');
      return;
    }

    const fetchStats = async () => {
      try {
        const [allBookings, allLots] = await Promise.all([
          adminAPI.getAllBookings(),
          adminAPI.getAllParkingLots(),
        ]);

        const bookings = Array.isArray(allBookings) ? allBookings : [];
        const lots = Array.isArray(allLots) ? allLots : [];

        setStats({
          totalBookings: bookings.length,
          activeBookings: bookings.filter((b) => b.status === 'ACTIVE' || b.status === 'active').length,
          cancelledBookings: bookings.filter((b) => b.status === 'CANCELLED' || b.status === 'cancelled').length,
          totalLots: lots.length,
          totalSpots: lots.reduce((sum, lot) => sum + (Number(lot.total_spots) || 0), 0),
          availableSpots: lots.reduce((sum, lot) => sum + (Number(lot.available_spots) || 0), 0),
        });
      } catch (error) {
        showNotification('Failed to load admin dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Manage bookings and parking lots</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Bookings</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalBookings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Active Bookings</div>
            <div className="mt-2 text-3xl font-semibold text-green-600">{stats.activeBookings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Cancelled Bookings</div>
            <div className="mt-2 text-3xl font-semibold text-red-600">{stats.cancelledBookings}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Parking Lots</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalLots}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Spots</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalSpots}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Available Spots</div>
            <div className="mt-2 text-3xl font-semibold text-green-600">{stats.availableSpots}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Link
            to="/admin/bookings"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Bookings</h3>
                <p className="mt-2 text-sm text-gray-600">View and manage all bookings</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </Link>

          <Link
            to="/admin/parking"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Manage Parking Lots</h3>
                <p className="mt-2 text-sm text-gray-600">View parking lot statistics</p>
              </div>
              <span className="text-2xl">🅿️</span>
            </div>
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

export default AdminDashboard;

