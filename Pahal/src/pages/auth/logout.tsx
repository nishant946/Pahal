import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Clear any stored auth tokens
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-data');
        
        // Add any additional cleanup here
        
        // Redirect to login page
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Handle any errors during logout
        navigate('/login');
      }
    };

    handleLogout();
  }, [navigate]);

  // Show a loading screen while logging out
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <LogOut className="h-6 w-6 text-red-600 animate-pulse" />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Logging Out...</h1>
        <p className="text-gray-500">Please wait while we log you out securely.</p>
      </div>
    </div>
  );
}
