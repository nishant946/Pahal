import api from '@/services/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  group: string;
  contact: string;
  parentName: string;
  address: string;
  joinDate: string;
}

interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  subjects: string[];
  qualification: string;
  joiningDate: string;
}

interface AttendanceRecord {
  date: string;
  presentStudents: Array<{
    id: string;
    name: string;
    rollNumber: string;
    grade: string;
    group: string;
    timeMarked: string;
  }>;
  presentTeachers: Array<{
    id: string;
    name: string;
    employeeId: string;
    department: string;
    timeMarked: string;
  }>;
}

interface AttendanceHistory {
  [date: string]: {
    students: {
      [id: string]: {
        status: 'present' | 'absent';
        timeMarked?: string;
      };
    };
    teachers: {
      [id: string]: {
        status: 'present' | 'absent';
        timeMarked?: string;
      };
    };
  };
}

interface AttendanceContextType {
  students: Student[];
  teachers: Teacher[];
  todayAttendance: AttendanceRecord;
  attendanceHistory: AttendanceHistory;
  addStudent: (student: Omit<Student, 'id'>) => void;
  editStudent: (id: string, student: Omit<Student, 'id'>) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  editTeacher: (id: string, teacher: Omit<Teacher, 'id'>) => void;
  deleteTeacher: (id: string) => void;
  markStudentAttendance: (studentId: string) => void;
  markTeacherAttendance: (teacherId: string) => void;
  unmarkStudentAttendance: (studentId: string) => void;
  unmarkTeacherAttendance: (teacherId: string) => void;
  getStudentAttendanceStats: (studentId: string, startDate: string, endDate: string) => {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendancePercentage: number;
  };
  getTeacherAttendanceStats: (teacherId: string, startDate: string, endDate: string) => {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    attendancePercentage: number;
  };
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(
    []
  );
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord>(
    {
      date: new Date().toISOString().split('T')[0],
      presentStudents: [
        {
          id: 'S001',
          name: 'Pallavi Singh',
          rollNumber: '2025001',
          grade: '10',
          group: 'A',
          timeMarked: '08:30 AM'
        },
        {
          id: 'S003',
          name: 'Priya Verma',
          rollNumber: '2025003',
          grade: '10',
          group: 'A',
          timeMarked: '08:35 AM'
        },
        {
          id: 'S005',
          name: 'Kirti Patel',
          rollNumber: '2025005',
          grade: '10',
          group: 'B',
          timeMarked: '08:40 AM'
        }
      ],
      presentTeachers: []
    }
  );
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistory>(
    {
      '2024-01-15': {
        students: {
          'S001': { status: 'present', timeMarked: '08:30 AM' },
          'S002': { status: 'present', timeMarked: '08:35 AM' },
          'S003': { status: 'present', timeMarked: '08:40 AM' },
          'S004': { status: 'present', timeMarked: '08:45 AM' }
        },
        teachers: {}
      },
      '2024-01-16': {
        students: {
          'S001': { status: 'present', timeMarked: '08:30 AM' },
          'S002': { status: 'present', timeMarked: '08:35 AM' },
          'S005': { status: 'present', timeMarked: '08:40 AM' }
        },
        teachers: {}
      }
    }
  );

  // Reset attendance at midnight
  useEffect(() => {
    const checkDate = () => {
      const currentDate = new Date().toISOString().split('T')[0];
      if (currentDate !== todayAttendance.date) {
        // Save current day's attendance to history before resetting
        setAttendanceHistory(prev => ({
          ...prev,
          [todayAttendance.date]: {
            students: Object.fromEntries(
              students.map(student => [
                student.id,
                {
                  status: todayAttendance.presentStudents.some(s => s.id === student.id) ? 'present' : 'absent',
                  timeMarked: todayAttendance.presentStudents.find(s => s.id === student.id)?.timeMarked
                }
              ])
            ),
            teachers: Object.fromEntries(
              teachers.map(teacher => [
                teacher.id,
                {
                  status: todayAttendance.presentTeachers.some(t => t.id === teacher.id) ? 'present' : 'absent',
                  timeMarked: todayAttendance.presentTeachers.find(t => t.id === teacher.id)?.timeMarked
                }
              ])
            )
          }
        }));

        // Reset today's attendance
        setTodayAttendance({
          date: currentDate,
          presentStudents: [],
          presentTeachers: []
        });
      }
    };

    const intervalId = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [todayAttendance.date, students, teachers]);

  const addStudent = async(student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: (students.length + 1).toString()
    };

    const response = await api.post('/student/add', newStudent);

    if (response.status !== 201) {
      console.error('Failed to add student:', response.data);
      return;
    }
    setStudents(prev => [...prev, newStudent]);
    
  };

  // get all students from database

  const getAllStudents = async () => {
    try {
      const response = await api.get('/student/all');
      if (response.status !== 200) throw new Error('Failed to fetch students');
      const data: Student[] = await response.data;
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);


  const editStudent = (id: string, updatedStudent: Omit<Student, 'id'>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...updatedStudent, id } : student
    ));
    
    // Update today's attendance if student is present
    setTodayAttendance(prev => ({
      ...prev,
      presentStudents: prev.presentStudents.map(student =>
        student.id === id
          ? {
              ...student,
              name: updatedStudent.name,
              rollNumber: updatedStudent.rollNumber,
              grade: updatedStudent.grade,
              group: updatedStudent.group
            }
          : student
      )
    }));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    setTodayAttendance(prev => ({
      ...prev,
      presentStudents: prev.presentStudents.filter(student => student.id !== id)
    }));
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = {
      ...teacher,
      id: (teachers.length + 1).toString()
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const editTeacher = (id: string, updatedTeacher: Omit<Teacher, 'id'>) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === id ? { ...updatedTeacher, id } : teacher
    ));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(teacher => teacher.id !== id));
    setTodayAttendance(prev => ({
      ...prev,
      presentTeachers: prev.presentTeachers.filter(teacher => teacher.id !== id)
    }));
  };

  const markStudentAttendance = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student || todayAttendance.presentStudents.some(s => s.id === studentId)) return;

    const timeMarked = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    setTodayAttendance(prev => ({
      ...prev,
      presentStudents: [
        ...prev.presentStudents,
        {
          id: student.id,
          name: student.name,
          rollNumber: student.rollNumber,
          grade: student.grade,
          group: student.group,
          timeMarked
        }
      ]
    }));

    // Update attendance history
    setAttendanceHistory(prev => ({
      ...prev,
      [todayAttendance.date]: {
        ...prev[todayAttendance.date],
        students: {
          ...prev[todayAttendance.date]?.students,
          [studentId]: { status: 'present', timeMarked }
        }
      }
    }));
  };

  const unmarkStudentAttendance = (studentId: string) => {
    setTodayAttendance(prev => ({
      ...prev,
      presentStudents: prev.presentStudents.filter(s => s.id !== studentId)
    }));

    // Update attendance history
    setAttendanceHistory(prev => ({
      ...prev,
      [todayAttendance.date]: {
        ...prev[todayAttendance.date],
        students: {
          ...prev[todayAttendance.date]?.students,
          [studentId]: { status: 'absent' }
        }
      }
    }));
  };

  const markTeacherAttendance = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher || todayAttendance.presentTeachers.some(t => t.id === teacherId)) return;

    const timeMarked = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    setTodayAttendance(prev => ({
      ...prev,
      presentTeachers: [
        ...prev.presentTeachers,
        {
          id: teacher.id,
          name: teacher.name,
          employeeId: teacher.employeeId,
          department: teacher.department,
          timeMarked
        }
      ]
    }));

    // Update attendance history
    setAttendanceHistory(prev => ({
      ...prev,
      [todayAttendance.date]: {
        ...prev[todayAttendance.date],
        teachers: {
          ...prev[todayAttendance.date]?.teachers,
          [teacherId]: { status: 'present', timeMarked }
        }
      }
    }));
  };

  const unmarkTeacherAttendance = (teacherId: string) => {
    setTodayAttendance(prev => ({
      ...prev,
      presentTeachers: prev.presentTeachers.filter(t => t.id !== teacherId)
    }));

    // Update attendance history
    setAttendanceHistory(prev => ({
      ...prev,
      [todayAttendance.date]: {
        ...prev[todayAttendance.date],
        teachers: {
          ...prev[todayAttendance.date]?.teachers,
          [teacherId]: { status: 'absent' }
        }
      }
    }));
  };

  const getStudentAttendanceStats = (studentId: string, startDate: string, endDate: string) => {
    const dates = Object.keys(attendanceHistory).filter(date => 
      date >= startDate && date <= endDate
    );

    const totalDays = dates.length;
    const presentDays = dates.filter(date => 
      attendanceHistory[date]?.students[studentId]?.status === 'present'
    ).length;

    return {
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendancePercentage: totalDays ? (presentDays / totalDays) * 100 : 0
    };
  };

  const getTeacherAttendanceStats = (teacherId: string, startDate: string, endDate: string) => {
    const dates = Object.keys(attendanceHistory).filter(date => 
      date >= startDate && date <= endDate
    );

    const totalDays = dates.length;
    const presentDays = dates.filter(date => 
      attendanceHistory[date]?.teachers[teacherId]?.status === 'present'
    ).length;

    return {
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendancePercentage: totalDays ? (presentDays / totalDays) * 100 : 0
    };
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        teachers,
        todayAttendance,
        attendanceHistory,
        addStudent,
        editStudent,
        deleteStudent,
        addTeacher,
        editTeacher,
        deleteTeacher,
        markStudentAttendance,
        markTeacherAttendance,
        unmarkStudentAttendance,
        unmarkTeacherAttendance,
        getStudentAttendanceStats,
        getTeacherAttendanceStats
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
