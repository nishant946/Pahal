import api from '@/services/api';
import React, { createContext, useContext, useState, useEffect, use } from 'react';

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
  getTodayAttendance: () => Promise<AttendanceRecord | undefined>;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord>({
    date: new Date().toISOString().split('T')[0],
    presentStudents: [],
    presentTeachers: [],
  });
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
    try {
      const response = await api.post('/student/add', student);
      if (response.status !== 201) {
        console.error('Failed to add student:', response.data);
        return;
      }
      const newStudent = response.data.student || response.data;
      setStudents(prev => [...prev, { ...newStudent, id: newStudent._id }]);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  // get all students from database

  const getAllStudents = async () => {
    try {
      const response = await api.get('/student/all');
      if (response.status !== 200) throw new Error('Failed to fetch students');
      const data: Student[] = response.data.map((s: any) => ({ ...s, id: s._id }));
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);


  const editStudent = async (id: string, updatedStudent: Omit<Student, 'id'>) => {
    try {
      const response = await api.put(`/student/${id}`, updatedStudent);
      console.log('Response from editStudent:', response);
      if (response.status === 400) {
        console.error('Failed to update student:', response.data);
        return;
      }
      const updated = response.data.student || response.data;
      setStudents(prev => prev.map(student => student.id === id ? { ...updated, id: updated._id || id } : student));
      setTodayAttendance(prev => ({
        ...prev,
        presentStudents: prev.presentStudents.map(student =>
          student.id === id
          ? { ...student, ...updated }
          : student
        )
      }));
    } catch (error) {
      alert('Failed to update student:');
    }
  };

  const deleteStudent = async (id: string) => {
  try {
    await api.delete(`/students/${id}`); // Make sure your backend route matches this
    setStudents(prev => prev.filter(student => student.id !== id));
    setTodayAttendance(prev => ({
      ...prev,
      presentStudents: prev.presentStudents.filter(student => student.id !== id)
    }));
  } catch (error) {
    console.error('Failed to delete student:', error);
  }
};

  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
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

  const markStudentAttendance = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student || todayAttendance.presentStudents.some(s => s.id === studentId)) return;

    const timeMarked = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const response = await api.post('/attendance/mark', {
      userId: studentId,
      date: todayAttendance.date,
      timeMarked,
      status: 'present'
    });

    if (response.status !== 201) {
      console.error('Failed to mark student attendance:', response.data);
      return;
    }


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

  const unmarkStudentAttendance = async (studentId: string) => {
    setTodayAttendance(prev => ({
      ...prev,
      presentStudents: prev.presentStudents.filter(s => s.id !== studentId)
    }));

    const response = await api.post(`/attendance/unmark`, {
      userId: studentId,
      date: todayAttendance.date,
      status: 'absent'
    });

    if (response.status !== 200) {
      console.error('Failed to unmark student attendance:', response.data);
      return;
    }

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

  // Get todays attendance stats for all students
  const getTodayAttendance = async () => {
    const date =
      todayAttendance.date ||
      new Date().toISOString().split('T')[0];
    const response = await api.get(`/attendance/date?date=${date}`);
    if (response.status !== 200) {
      console.error('Failed to fetch today\'s attendance stats:', response.data);
      return;
    }
    return response.data;
  };

  useEffect( () => {
    const fetchTodayAttendance = async () => {
      const attendance = await getTodayAttendance();
    console.log('Fetched today\'s attendance:', attendance);
      if (attendance) {
        setTodayAttendance({
          date: attendance.date || new Date().toISOString().split('T')[0],
          presentStudents: attendance.presentStudents ?? [],
          presentTeachers: [],
        });
      }
    };
    fetchTodayAttendance();
    // eslint-disable-next-line
  }, []); // Only on mount

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
        getTodayAttendance,
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
