import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            <span className="text-primary-600">Smart Parking</span> System
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Find and reserve parking spots effortlessly. Real-time availability, instant bookings, and seamless management.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/parking"
              className="px-8 py-3 text-lg font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
            >
              Browse Parking Lots
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="px-8 py-3 text-lg font-semibold text-primary-600 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition border-2 border-primary-600"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Spots</h3>
            <p className="text-gray-600">Browse available parking lots and see real-time spot availability.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Instantly</h3>
            <p className="text-gray-600">Reserve your parking spot in seconds with our streamlined booking process.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600">Receive instant notifications about your bookings and spot availability.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

