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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyTeacher: (teacherId: string) => Promise<void>;
  rejectTeacher: (teacherId: string) => Promise<void>;
  addTeacher: (teacherData: Omit<Teacher, 'id'>) => Promise<void>;
  removeTeacher: (teacherId: string) => Promise<void>;
}

const TeacherAuthContext = createContext<TeacherAuthContextType | undefined>(undefined);

export function TeacherAuthProvider({ children }: { children: React.ReactNode }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedTeacher = localStorage.getItem('teacher');
    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/teacher/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data = await response.json();
      setTeacher(data.teacher);
      localStorage.setItem('teacher', JSON.stringify(data.teacher));

      // Redirect based on role
      if (data.teacher.isAdmin) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setTeacher(null);
    localStorage.removeItem('teacher');
  };

  const verifyTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/admin/teachers/${teacherId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw new Error('Failed to verify teacher');
    }
  };

  const rejectTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/admin/teachers/${teacherId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw new Error('Failed to reject teacher');
    }
  };

  const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      // TODO: Replace with actual API call
      await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherData),
      });
    } catch (error) {
      throw new Error('Failed to add teacher');
    }
  };

  const removeTeacher = async (teacherId: string) => {
    if (!teacher?.isAdmin) throw new Error('Unauthorized');
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/admin/teachers/${teacherId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      throw new Error('Failed to remove teacher');
    }
  };

  return (
    <TeacherAuthContext.Provider value={{
      teacher,
      isLoading,
      login,
      logout,
      verifyTeacher,
      rejectTeacher,
      addTeacher,
      removeTeacher,
    }}>
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
