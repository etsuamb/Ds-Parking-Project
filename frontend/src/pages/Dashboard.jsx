import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../api/bookings';
import { parkingAPI } from '../api/parking';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, lotsData] = await Promise.all([
          bookingsAPI.getMyBookings(),
          parkingAPI.getLots(),
        ]);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setLots(Array.isArray(lotsData) ? lotsData : []);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const totalSpots = lots.reduce((sum, lot) => sum + (lot.totalSpots || 0), 0);
  const availableSpots = lots.reduce((sum, lot) => sum + (lot.availableSpots || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Active Bookings</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{activeBookings.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Bookings</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{bookings.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Spots</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{totalSpots}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Available Spots</div>
            <div className="mt-2 text-3xl font-semibold text-primary-600">{availableSpots}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <Link
                  to="/bookings"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {activeBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No active bookings</p>
              ) : (
                <div className="space-y-4">
                  {activeBookings.slice(0, 5).map((booking) => (
                    <Link
                      key={booking.id}
                      to={`/bookings/${booking.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            Lot {booking.lotId} - Spot {booking.spotId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {booking.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Parking Lots</h2>
                <Link
                  to="/parking"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Browse all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {lots.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No parking lots available</p>
              ) : (
                <div className="space-y-4">
                  {lots.map((lot) => (
                    <Link
                      key={lot.id}
                      to={`/parking/${lot.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">Lot {lot.id}</div>
                          <div className="text-sm text-gray-500">
                            {lot.availableSpots || 0} / {lot.totalSpots || 0} spots available
                          </div>
                        </div>
                        <div className="text-primary-600">→</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/bookings/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Create New Booking
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

