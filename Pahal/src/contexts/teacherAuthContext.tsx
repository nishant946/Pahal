import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginTeacher, 
  logoutTeacher, 
  getCurrentTeacher, 
  isTeacherAuthenticated,
  registerTeacher,
  type TeacherLoginCredentials,
  type TeacherRegistrationData,
  type TeacherAuthResponse
} from '@/services/teacherAuthService';

interface TeacherAuthContextType {
  isAuthenticated: boolean;
  teacher: TeacherAuthResponse['teacher'] | null;
  register: (data: TeacherRegistrationData) => Promise<void>;
  login: (credentials: TeacherLoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const TeacherAuthContext = createContext<TeacherAuthContextType | undefined>(undefined);

export function TeacherAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(isTeacherAuthenticated());
  const [teacher, setTeacher] = useState<TeacherAuthResponse['teacher'] | null>(getCurrentTeacher());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authenticated = isTeacherAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setTeacher(getCurrentTeacher());
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: TeacherLoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginTeacher(credentials);
      setIsAuthenticated(true);
      setTeacher(response.teacher);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const register = async (data: TeacherRegistrationData) => {
    setLoading(true);
    setError(null);
    try {
      await registerTeacher(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutTeacher();
    setIsAuthenticated(false);
    setTeacher(null);
  };

  return (
    <TeacherAuthContext.Provider
      value={{
        isAuthenticated,
        teacher,
        register,
        login,
        logout,
        loading,
        error
      }}
    >
      {children}
    </TeacherAuthContext.Provider>
  );
}

export function useTeacherAuth() {
  const context = useContext(TeacherAuthContext);
  if (context === undefined) {
    throw new Error('useTeacherAuth must be used within a TeacherAuthProvider');
  }
  return context;
}
