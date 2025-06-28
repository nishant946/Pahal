import React, { createContext, useContext, useState, useEffect } from 'react';
import homeworkService from '@/services/homeworkService';
import type { Homework } from '@/services/homeworkService';
import { useTeacherAuth } from './teacherAuthContext';

interface HomeworkContextType {
  homework: Homework[];
  loading: boolean;
  addHomework: (homework: Omit<Homework, 'id' | 'assignedBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHomework: (id: string, homework: Partial<Homework>) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;
  getHomeworkByGroup: (group: Homework['group']) => Homework[];
  getRecentHomework: () => Homework[];
  getYesterdayHomework: () => Homework[];
  refreshHomework: () => Promise<void>;
}

const HomeworkContext = createContext<HomeworkContextType | undefined>(undefined);

export function HomeworkProvider({ children }: { children: React.ReactNode }) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const { teacher } = useTeacherAuth();

  const fetchHomework = async () => {
    try {
      setLoading(true);
      const data = await homeworkService.getAllHomework();
      setHomework(data);
    } catch (error) {
      console.error('Error fetching homework:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomework();
  }, []);

  const addHomework = async (newHomework: Omit<Homework, 'id' | 'assignedBy' | 'createdAt' | 'updatedAt'>) => {
    if (!teacher) {
      throw new Error('Teacher not authenticated');
    }

    try {
      const homework = await homeworkService.createHomework({
        ...newHomework,
        assignedBy: teacher._id
      });
      setHomework(prev => [homework, ...prev]);
    } catch (error) {
      console.error('Error adding homework:', error);
      throw error;
    }
  };

  const updateHomework = async (id: string, updatedHomework: Partial<Homework>) => {
    try {
      const homework = await homeworkService.updateHomework(id, updatedHomework);
      setHomework(prev => prev.map(hw => hw.id === id ? homework : hw));
    } catch (error) {
      console.error('Error updating homework:', error);
      throw error;
    }
  };

  const deleteHomework = async (id: string) => {
    try {
      await homeworkService.deleteHomework(id);
      setHomework(prev => prev.filter(hw => hw.id !== id));
    } catch (error) {
      console.error('Error deleting homework:', error);
      throw error;
    }
  };

  const getHomeworkByGroup = (group: Homework['group']) => {
    return homework.filter(hw => hw.group === group);
  };

  const getRecentHomework = () => {
    const today = new Date().toISOString().split('T')[0];
    return homework.filter(hw => hw.dateAssigned === today);
  };

  const getYesterdayHomework = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return homework.filter(hw => hw.dateAssigned === yesterdayStr);
  };

  const refreshHomework = async () => {
    await fetchHomework();
  };

  return (
    <HomeworkContext.Provider
      value={{
        homework,
        loading,
        addHomework,
        updateHomework,
        deleteHomework,
        getHomeworkByGroup,
        getRecentHomework,
        getYesterdayHomework,
        refreshHomework
      }}
    >
      {children}
    </HomeworkContext.Provider>
  );
}

export const useHomework = () => {
  const context = useContext(HomeworkContext);
  if (context === undefined) {
    throw new Error('useHomework must be used within a HomeworkProvider');
  }
  return context;
};