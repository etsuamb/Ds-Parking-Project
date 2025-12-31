import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import { adminAuth } from '../../auth/adminAuth';
import Sidebar from '../../components/admin/Sidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalParkingLots: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, bookingsRes, lotsRes] = await Promise.all([
        adminApi.get('/auth/users').catch(() => ({ data: [] })),
        adminApi.get('/admin/bookings').catch(() => ({ data: [] })),
        adminApi.get('/admin/parking/lots').catch(() => ({ data: [] })),
      ]);

      setStats({
        totalUsers: usersRes.data.length || 0,
        totalBookings: bookingsRes.data.length || 0,
        totalParkingLots: lotsRes.data.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark-bg flex">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        {/* Top Navbar */}
        <nav className="dark-navbar shadow-lg sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
            <div className="dark-card-hover rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 flex-1">
                  <p className="text-sm font-medium text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="dark-card-hover rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 gradient-success rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 flex-1">
                  <p className="text-sm font-medium text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="dark-card-hover rounded-xl p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 flex-1">
                  <p className="text-sm font-medium text-gray-400">Parking Lots</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalParkingLots}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link
              to="/admin/bookings"
              className="block dark-card-hover rounded-xl p-8 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Manage Bookings</h3>
              <p className="text-sm text-gray-400">View and manage all user bookings</p>
            </Link>

            <Link
              to="/admin/parking"
              className="block dark-card-hover rounded-xl p-8 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Manage Parking</h3>
              <p className="text-sm text-gray-400">Create and manage parking lots</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

