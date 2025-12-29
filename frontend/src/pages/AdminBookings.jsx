import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminAPI } from '../api/admin';
import { useNotification } from '../hooks/useNotification';
import NotificationModal from '../components/NotificationModal';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminBookings = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (!isAdmin) {
      showNotification('Access denied. Admin privileges required.', 'error');
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await adminAPI.getAllBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        showNotification('Failed to load bookings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAdmin, showNotification]);

  const handleCancelClick = (id) => {
    setBookingToCancel(id);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    setCancellingId(bookingToCancel);
    setShowCancelModal(false);

    try {
      await adminAPI.cancelBooking(bookingToCancel);
      showNotification('Booking cancelled successfully', 'success');

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingToCancel || b.booking_id === bookingToCancel
            ? { ...b, status: 'CANCELLED' }
            : b
        )
      );
    } catch (error) {
      showNotification(
        error.response?.data?.error || error.response?.data?.message || 'Failed to cancel booking',
        'error'
      );
    } finally {
      setCancellingId(null);
      setBookingToCancel(null);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
          <p className="mt-2 text-sm text-gray-600">Manage all user bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-xl">No bookings found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id || booking.booking_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id || booking.booking_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.user_id || booking.userId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.lot_id || booking.lotId ? `Lot ${booking.lot_id || booking.lotId}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.spot_id || booking.spotId ? `Spot ${booking.spot_id || booking.spotId}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'ACTIVE' || booking.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'CANCELLED' || booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.created_at || booking.createdAt
                        ? new Date(booking.created_at || booking.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(booking.status === 'ACTIVE' || booking.status === 'active') && (
                        <button
                          onClick={() => handleCancelClick(booking.id || booking.booking_id)}
                          disabled={cancellingId === (booking.id || booking.booking_id)}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === (booking.id || booking.booking_id) ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Booking</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleCancelModalClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;

