import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';

interface VerifiedTeacherProtectedRouteProps {
  children: React.ReactNode;
}

const VerifiedTeacherProtectedRoute: React.FC<VerifiedTeacherProtectedRouteProps> = ({ children }) => {
  const { teacher, isLoading } = useTeacherAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!teacher) {
    return <Navigate to="/login" replace />;
  }

  if (!teacher.isVerified) {
    return <Navigate to="/pending-verification" replace />;
  }

  return <>{children}</>;
};

export default VerifiedTeacherProtectedRoute; 