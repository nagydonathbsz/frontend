import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';

function ProtectedRoute({ children }) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <div className="container">Betöltés...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
