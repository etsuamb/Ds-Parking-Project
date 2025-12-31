import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { adminAuth } from '../../auth/adminAuth';
import Toast from '../../components/admin/Toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Sidebar from '../../components/admin/Sidebar';

const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await adminApi.get(`/admin/bookings/${id}`);
      setBooking(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch booking details');
      setToast({ message: 'Failed to fetch booking details', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setShowCancelModal(false);
    try {
      await adminApi.post(`/admin/bookings/${id}/cancel`);
      setToast({ message: 'Booking cancelled successfully', type: 'success' });
      // Refresh booking data
      fetchBooking();
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to cancel booking', type: 'error' });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen dark-bg flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <nav className="dark-navbar shadow-lg">
            <div className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/admin/bookings')}
                  className="text-gray-300 hover:bg-slate-700 rounded-lg p-2 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-white">Booking Details</h1>
              </div>
            </div>
          </nav>
          <main className="p-6">
            <div className="bg-red-900/20 border-l-4 border-red-500 text-red-300 px-4 py-3 rounded-r-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isCancelled = booking.status === 'cancelled' || booking.status === 'CANCELLED';
  const isPending = booking.status === 'pending' || booking.status === 'PENDING';

  return (
    <div className="min-h-screen dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <nav className="dark-navbar shadow-lg sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/admin/bookings')}
                  className="text-gray-300 hover:bg-slate-700 rounded-lg p-2 transition-all duration-200"
                  title="Back to Bookings"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-white">Booking Details</h1>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-xs">
                      {adminAuth.getUser()?.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-200 hidden md:block">
                    {adminAuth.getUser()?.email || 'Admin'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="dark-card rounded-xl overflow-hidden">
              <div className="px-6 py-6 border-b border-slate-700 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Booking #{booking.id}
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                      Detailed booking information
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      isCancelled
                        ? 'bg-red-900/30 text-red-300 border border-red-700'
                        : isPending
                        ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700'
                        : 'bg-green-900/30 text-green-300 border border-green-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-700">
                <div className="px-6 py-5 bg-slate-800/30">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">User Information</p>
                      <p className="text-base font-semibold text-white">
                        {booking.user ? (
                          <>
                            {booking.user.email || booking.user.username || `User ID: ${booking.user.id}`}
                            {booking.user.email && booking.user.username && (
                              <span className="block text-xs text-gray-400 font-normal mt-0.5">
                                {booking.user.username}
                              </span>
                            )}
                          </>
                        ) : (
                          `User ID: ${booking.user_id}`
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Parking Lot</p>
                      <p className="text-base font-semibold text-white">{booking.lot_id}</p>
                    </div>
                    {booking.spot_id && (
                      <div>
                        <p className="text-sm font-medium text-gray-400 mb-1">Parking Spot</p>
                        <p className="text-base font-semibold text-white">{booking.spot_id}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400 mb-1">Created At</p>
                      <p className="text-base font-semibold text-white">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(booking.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {!isCancelled && (
                <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700 flex justify-end">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="btn-danger px-6 py-2.5"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
      />
    </div>
  );
};

export default AdminBookingDetails;

