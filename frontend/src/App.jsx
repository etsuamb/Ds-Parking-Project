import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { initSocket, disconnectSocket } from "./utils/socket";
import { useAuth } from "./hooks/useAuth";
import { useNotification } from "./hooks/useNotification";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationModal from "./components/NotificationModal";

// Admin Components
import AdminRoutes from './admin/router/AdminRoutes';

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Parking from "./pages/Parking";
import ParkingLotDetails from "./pages/ParkingLotDetails";
import CreateBooking from "./pages/CreateBooking";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const { notification, showNotification, hideNotification } =
    useNotification();

  // Only show sidebar when authenticated and not on login/register pages
  const showSidebar =
    !loading &&
    isAuthenticated &&
    !["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    // Initialize socket connection only if authenticated
    // Socket connection will attempt to connect, but won't block if unavailable
    const socket = initSocket();

    // Listen for notifications
    const notificationHandler = (data) => {
      const message =
        typeof data === "string" ? data : data.message || "New notification";
      showNotification(message, "success", 4000);
    };

    socket.on("notification", notificationHandler);

    // Cleanup on unmount
    return () => {
      socket.off("notification", notificationHandler);
      // Don't disconnect socket completely, just remove listeners
      // This allows the socket to stay connected for other components
    };
  }, [showNotification]);

  // Check if current path is admin
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <div className="flex pt-16">
        {showSidebar && <Sidebar />}
        <main
          className="flex-1 transition-all duration-300"
          style={{
            marginLeft: showSidebar ? "var(--sidebar-w, 0px)" : "0px",
            transition: "margin-left 300ms ease-in-out",
          }}
        >
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
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
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
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
