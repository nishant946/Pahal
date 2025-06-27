import React, { createContext,  useState, useEffect } from 'react';
import api from '@/services/api';

interface Teacher {
  id: string;
  username: string;
  email: string;
  department: string;
  mobile: string;
  isAdmin?: boolean;
}

interface registrationData {
  name: string;
  email: string;
  department: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  rollNumber: string;
  isAdmin?: boolean; // Optional, default to false for regular users
}

interface TeacherAuthContextType {
  teacher: Teacher | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (registrationData: registrationData) => Promise<void>;
  verifyTeacher: (teacherId: string) => Promise<void>;
  rejectTeacher: (teacherId: string) => Promise<void>;
  addTeacher: (teacherData: Omit<Teacher, 'id'>) => Promise<void>;
  removeTeacher: (teacherId: string) => Promise<void>;
}

const TeacherAuthContext = createContext<TeacherAuthContextType | undefined>(undefined);

export function TeacherAuthProvider({ children }: { children: React.ReactNode }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true); // for initial load
  const [loading, setLoading] = useState(false); // for async ops
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedTeacher = localStorage.getItem('teacher');
    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
    }
    setIsLoading(false);
  }, []);
const login = async (email: string, password: string) => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.post('/auth/login', { email, password });
    
    // ✅ Now `response` is the full Axios response
    console.log("Status:", response.status);
    console.log("Data:", response.data); // Contains user, token, etc.

    if (![200, 201].includes(response.status)) {
      throw new Error('Login failed');
    }

    const user = response.data.user;
    if (!user) throw new Error('Invalid response from server');

    setTeacher(user);
    localStorage.setItem('teacher', JSON.stringify(user));
    localStorage.setItem('teacherToken', response.data.token); // Store token

    window.location.href = user.isAdmin ? '/admin' : '/dashboard';
  } catch (err) {
    setError('Login failed');
  } finally {
    setLoading(false);
  }
};

const register = async (registrationData: registrationData) => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.post('/auth/register', registrationData);

    if (response.status !== 201) throw new Error('Registration failed');

    const user = response.data.user;
    setTeacher(user);
    localStorage.setItem('teacher', JSON.stringify(user));

    window.location.href = user.isAdmin ? '/admin' : '/dashboard';
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
      err.message ||
      'Registration failed'
    );
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setTeacher(null);
    localStorage.removeItem('teacher');
  };

  const verifyTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      await api.post(`/admin/teachers/${teacherId}/verify`);
    } catch {
      throw new Error('Failed to verify teacher');
    }
  };

  const rejectTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      await api.post(`/admin/teachers/${teacherId}/reject`);
    } catch {
      throw new Error('Failed to reject teacher');
    }
  };

  const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      await api.post('/admin/teachers', teacherData);
    } catch {
      throw new Error('Failed to add teacher');
    }
  };

  const removeTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      await api.delete(`/admin/teachers/${teacherId}`);
    } catch {
      throw new Error('Failed to remove teacher');
    }
  };

  return (
    <TeacherAuthContext.Provider
      value={{
        teacher,
        isLoading,
        loading,
        error,
        login,
        logout,
        register,
        verifyTeacher,
        rejectTeacher,
        addTeacher,
        removeTeacher,
      }}
    >
      {children}
    </TeacherAuthContext.Provider>
  );
}

export const useTeacherAuth = () => {
  const context = React.useContext(TeacherAuthContext);
  if (!context) {
    throw new Error('useTeacherAuth must be used within a TeacherAuthProvider');
  }
  return context;
};
