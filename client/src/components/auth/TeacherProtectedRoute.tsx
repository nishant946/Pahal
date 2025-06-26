export function TeacherProtectedRoute({ children }: { children: React.ReactNode }) {
  // Temporarily return children directly without authentication check
  return <>{children}</>;

  // Authentication logic commented out for now
  /*
  const { isAuthenticated, loading } = useTeacherAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
  */
}
