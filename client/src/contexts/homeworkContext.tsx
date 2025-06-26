import React, { createContext, useContext, useState } from 'react';

interface Homework {
  id: string;
  group: 'A' | 'B' | 'C';
  subject: string;
  description: string;
  dueDate: string;
  dateAssigned: string;
  status: 'pending' | 'completed';
}

interface HomeworkContextType {
  homework: Homework[];
  addHomework: (homework: Omit<Homework, 'id'>) => void;
  updateHomework: (id: string, homework: Partial<Homework>) => void;
  getHomeworkByGroup: (group: Homework['group']) => Homework[];
  getRecentHomework: () => Homework[];
  getYesterdayHomework: () => Homework[];
}

const HomeworkContext = createContext<HomeworkContextType | undefined>(undefined);

export function HomeworkProvider({ children }: { children: React.ReactNode }) {
  const [homework, setHomework] = useState<Homework[]>(
    [
      {
        id: '1',
        group: 'A',
        subject: 'Mathematics',
        description: 'Complete exercises on addition and subtraction',
        dueDate: '2025-05-24',
        dateAssigned: '2025-05-23',
        status: 'pending'
      },
      {
        id: '2',
        group: 'B',
        subject: 'Science',
        description: 'Read chapter on plant life cycle and answer questions',
        dueDate: '2025-05-24',
        dateAssigned: '2025-05-23',
        status: 'pending'
      },
      {
        id: '3',
        group: 'C',
        subject: 'English',
        description: 'Write a 500-word essay on environmental conservation',
        dueDate: '2025-05-24',
        dateAssigned: '2025-05-23',
        status: 'pending'
      },
      {
        id: '4',
        group: 'A',
        subject: 'Science',
        description: 'Complete experiment report on plant growth',
        dueDate: '2025-05-23',
        dateAssigned: '2025-05-22',
        status: 'completed'
      },
      {
        id: '5',
        group: 'B',
        subject: 'English',
        description: 'Read chapter 5 and answer comprehension questions',
        dueDate: '2025-05-23',
        dateAssigned: '2025-05-22',
        status: 'completed'
      },
      {
        id: '6',
        group: 'C',
        subject: 'Mathematics',
        description: 'Solve geometry problems from worksheet',
        dueDate: '2025-05-23',
        dateAssigned: '2025-05-22',
        status: 'completed'
      }
    ]
  );

  const addHomework = (newHomework: Omit<Homework, 'id'>) => {
    const homework: Homework = {
      ...newHomework,
      id: Date.now().toString()
    };
    setHomework(prev => [...prev, homework]);
  };

  const updateHomework = (id: string, updatedHomework: Partial<Homework>) => {
    setHomework(prev => prev.map(hw => 
      hw.id === id ? { ...hw, ...updatedHomework } : hw
    ));
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

  return (
    <HomeworkContext.Provider
      value={{
        homework,
        addHomework,
        updateHomework,
        getHomeworkByGroup,
        getRecentHomework,
        getYesterdayHomework
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