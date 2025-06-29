import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface Teacher {
  _id: string;
  rollNo: string;
  name: string;
  mobileNo: string;
  email: string;
  department: string;
  preferredDays: string[];
  subjectChoices: string[];
  designation: string;
  qualification?: string;
  joiningDate: string;
  isVerified: boolean;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface registrationData {
  name: string;
  email: string;
  department: string;
  password: string;
  mobile: string;
  rollNumber: string;
  preferredDays: string[];
  subjectChoices: string[];
}

interface TeacherAuthContextType {
  teacher: Teacher | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<Teacher>;
  logout: () => void;
  register: (registrationData: registrationData) => Promise<any>;
  verifyTeacher: (teacherId: string) => Promise<void>;
  getUnverifiedTeachers: () => Promise<Teacher[]>;
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
      try {
        const teacherData = JSON.parse(storedTeacher);
        setTeacher(teacherData);
      } catch (error) {
        console.error('Error parsing stored teacher:', error);
        localStorage.removeItem('teacher');
      }
    }
    setIsLoading(false);
  }, []);

const login = async (email: string, password: string) => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.post('/auth/login', { email, password });

    if (![200, 201].includes(response.status)) {
      throw new Error('Login failed');
    }

      const teacherData = response.data.teacher;
      if (!teacherData) throw new Error('Invalid response from server');

      setTeacher(teacherData);
      localStorage.setItem('teacher', JSON.stringify(teacherData));
      localStorage.setItem('teacherToken', response.data.token);

      // Return the teacher data for the component to handle redirection
      return teacherData;
    } catch (err: any) {
      console.error('Login error in context:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
  } finally {
    setLoading(false);
  }
};

const register = async (registrationData: registrationData) => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.post('/auth/register', registrationData);

      if (response.status === 201) {
        // Registration successful, don't redirect automatically
        // Let the component handle the redirect
        return response.data;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw error;
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setTeacher(null);
    localStorage.removeItem('teacher');
    localStorage.removeItem('teacherToken');
    window.location.href = '/login';
  };

  const verifyTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      await api.patch(`/admin/teachers/${teacherId}/verify`);
    } catch {
      throw new Error('Failed to verify teacher');
    }
  };

  const getUnverifiedTeachers = async (): Promise<Teacher[]> => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      const response = await api.get('/admin/teachers/unverified');
      return response.data.teachers;
    } catch {
      throw new Error('Failed to fetch unverified teachers');
    }
  };

  return (
    <TeacherAuthContext.Provider value={{
        teacher,
        isLoading,
        loading,
        error,
        login,
        logout,
        register,
        verifyTeacher,
      getUnverifiedTeachers
    }}>
      {children}
    </TeacherAuthContext.Provider>
  );
}

export const useTeacherAuth = () => {
  const context = useContext(TeacherAuthContext);
  if (context === undefined) {
    throw new Error('useTeacherAuth must be used within a TeacherAuthProvider');
  }
  return context;
};
