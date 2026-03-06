import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  fallback?: ReactNode;
}

export function ProtectedRoute({ children, requireAdmin = false, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (!user) {
    return fallback || <div className="text-center p-8">Veuillez vous connecter</div>;
  }

  if (requireAdmin && !user.isAdmin) {
    return fallback || <div className="text-center p-8">Accès refusé</div>;
  }

  return <>{children}</>;
}
