import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, legacyAuthenticated }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-emerald-600 font-bold">Verifying Session...</div>;
  }

  // Check both the new AuthContext and the legacy profile.authenticated flag to avoid breaking AfterMa features incrementally.
  if (!user && !legacyAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
