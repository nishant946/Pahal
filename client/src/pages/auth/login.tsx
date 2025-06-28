import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTeacherAuth } from '@/contexts/teacherAuthContext';

function Login() {
  
  const { login } = useTeacherAuth();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }
      
      console.log('Attempting login with:', formData.email);
      const teacherData = await login(formData.email, formData.password);
      console.log('Login successful:', teacherData);
      
      // Handle redirection based on user role and verification status
      if (teacherData.isAdmin) {
        // Admin users go directly to admin panel
        navigate('/admin');
      } else if (teacherData.isVerified) {
        // Verified teachers go to dashboard
        navigate('/dashboard');
      } else {
        // Unverified teachers go to pending verification page
        navigate('/pending-verification');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-sm">
        <div>
          <h1 className="text-center text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>
        
        {successMessage && (
          <Alert>
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-1"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-blue-500 cursor-pointer font-bold hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;