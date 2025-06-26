import React, { createContext, useContext, useState, useEffect } from 'react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
}

interface TeacherAuthContextType {
  teacher: Teacher | null;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (teacherData: Omit<Teacher, 'id'> & { password: string }) => Promise<void>;
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
      const response = await fetch('/api/auth/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      setTeacher(data.teacher);
      localStorage.setItem('teacher', JSON.stringify(data.teacher));

      window.location.href = data.teacher.isAdmin ? '/admin' : '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (teacherData: Omit<Teacher, 'id'> & { password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/teacher/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherData),
      });

      if (!response.ok) throw new Error('Registration failed');

      const data = await response.json();
      setTeacher(data.teacher);
      localStorage.setItem('teacher', JSON.stringify(data.teacher));

      window.location.href = data.teacher.isAdmin ? '/admin' : '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
      await fetch(`/api/admin/teachers/${teacherId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      throw new Error('Failed to verify teacher');
    }
  };

  const rejectTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      await fetch(`/api/admin/teachers/${teacherId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      throw new Error('Failed to reject teacher');
    }
  };

  const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherData),
      });
    } catch {
      throw new Error('Failed to add teacher');
    }
  };

  const removeTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      await fetch(`/api/admin/teachers/${teacherId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
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

export function useTeacherAuth() {
  const context = useContext(TeacherAuthContext);
  if (context === undefined) {
    throw new Error('useTeacherAuth must be used within a TeacherAuthProvider');
  }
  return context;
}
