import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useUser();

  if (loading) return null;

  return token ? children : <Navigate to="/login" />;
}
