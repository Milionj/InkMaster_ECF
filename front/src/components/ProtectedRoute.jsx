import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useUser();

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/login" />;
}
