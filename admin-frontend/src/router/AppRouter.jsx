import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/admin/ProtectedRoute';
import { adminAuth } from '../auth/adminAuth';

// Pages
import AdminLogin from '../pages/admin/Login';
import AdminRegister from '../pages/admin/Register';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminBookings from '../pages/admin/Bookings';
import AdminBookingDetails from '../pages/admin/BookingDetails';
import AdminParking from '../pages/admin/Parking';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/login"
          element={
            adminAuth.isAuthenticated() ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin/register"
          element={
            adminAuth.isAuthenticated() ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminRegister />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings/:id"
          element={
            <ProtectedRoute>
              <AdminBookingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parking"
          element={
            <ProtectedRoute>
              <AdminParking />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

