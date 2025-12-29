import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { initSocket, disconnectSocket } from './utils/socket';
import { useAuth } from './hooks/useAuth';
import toast from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Parking from './pages/Parking';
import ParkingLotDetails from './pages/ParkingLotDetails';
import CreateBooking from './pages/CreateBooking';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Initialize socket connection only if authenticated
    // Socket connection will attempt to connect, but won't block if unavailable
    const socket = initSocket();

    // Listen for notifications
    const notificationHandler = (data) => {
      const message = typeof data === 'string' ? data : data.message || 'New notification';
      toast.success(message, {
        duration: 5000,
        position: 'top-right',
      });
    };

    socket.on('notification', notificationHandler);

    // Cleanup on unmount
    return () => {
      socket.off('notification', notificationHandler);
      // Don't disconnect socket completely, just remove listeners
      // This allows the socket to stay connected for other components
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/parking" element={<Parking />} />
          <Route path="/parking/:lotId" element={<ParkingLotDetails />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/new"
            element={
              <ProtectedRoute>
                <CreateBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

