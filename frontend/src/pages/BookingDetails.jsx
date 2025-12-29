import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingsAPI } from '../api/bookings';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await bookingsAPI.getBooking(id);
        setBooking(data);
      } catch (error) {
        toast.error('Failed to load booking details');
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelling(true);

    try {
      await bookingsAPI.cancelBooking(id);
      toast.success('Booking cancelled successfully');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-xl">Booking not found</p>
            <Link to="/bookings" className="mt-4 text-primary-600 hover:text-primary-700">
              ← Back to Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/bookings"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to My Bookings
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                booking.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : booking.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {booking.status}
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500">Booking ID</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">{booking.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                  {booking.status}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Parking Lot</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">
                  <Link
                    to={`/parking/${booking.lotId}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Lot {booking.lotId}
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Parking Spot</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">Spot {booking.spotId}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Created At</div>
                <div className="mt-1 text-lg text-gray-900">
                  {new Date(booking.createdAt).toLocaleString()}
                </div>
              </div>
              {booking.updatedAt && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Last Updated</div>
                  <div className="mt-1 text-lg text-gray-900">
                    {new Date(booking.updatedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>

            {booking.status === 'active' && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? <LoadingSpinner size="sm" /> : 'Cancel Booking'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

