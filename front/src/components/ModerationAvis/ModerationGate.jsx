import { useUser } from '../../context/UserContext';
import { Navigate } from 'react-router-dom';
import ModerationAvis from './ModerationAvis';

export default function ModerationGate() {
  const { role } = useUser();

  if (role === 'artiste') {
    return <ModerationAvis />;
  }

  return <Navigate to="/" />;
}
