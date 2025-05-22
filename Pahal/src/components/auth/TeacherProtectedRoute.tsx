import { Navigate, useLocation } from 'react-router-dom';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';

export function TeacherProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useTeacherAuth();
  const location = useLocation();

  if (loading) {
    // You can replace this with a loading spinner component
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/auth/teacher-login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
