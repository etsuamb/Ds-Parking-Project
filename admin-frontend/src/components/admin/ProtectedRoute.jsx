import { Navigate } from 'react-router-dom';
import { adminAuth } from '../../auth/adminAuth';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = adminAuth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

