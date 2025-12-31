import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";

const Home = () => {
  const { isAuthenticated, loading } = useAuth();

  // Don't show auth-dependent content until loading is complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: "var(--accent)" }}
        ></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            <Logo className="w-20 h-20" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-200 sm:text-6xl">
            <span className="text-primary-600 link-accent">Smart Parking</span>{" "}
            System
          </h1>
          <p className="mt-6 text-xl text-muted max-w-3xl mx-auto">
            Find and reserve parking spots effortlessly. Real-time availability,
            instant bookings, and seamless management.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/parking" className="btn-primary">
              Browse Parking Lots
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn-ghost">
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="app-card rounded-lg p-6">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Find Spots
            </h3>
            <p className="text-muted">
              Browse available parking lots and see real-time spot availability.
            </p>
          </div>
          <div className="app-card rounded-lg p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Book Instantly
            </h3>
            <p className="text-muted">
              Reserve your parking spot in seconds with our streamlined booking
              process.
            </p>
          </div>
          <div className="app-card rounded-lg p-6">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              Real-time Updates
            </h3>
            <p className="text-muted">
              Receive instant notifications about your bookings and spot
              availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
