import api from './api';

export interface DashboardStats {
  students: {
    total: number;
    presentToday: number;
    absentToday: number;
    attendancePercentage: string;
  };
  teachers: {
    total: number;
    verified: number;
    presentToday: number;
    verificationPercentage: string;
  };
  homework: {
    total: number;
    pending: number;
    completed: number;
    completionPercentage: string;
  };
  recentActivity: {
    studentAttendance: Array<{
      id: string;
      date: string;
      status: string;
      student: {
        id: string;
        name: string;
        rollNumber: string;
      };
    }>;
    teacherAttendance: Array<{
      id: string;
      date: string;
      status: string;
      teacher: {
        id: string;
        name: string;
        rollNo: string;
      };
    }>;
    homework: Array<{
      id: string;
      subject: string;
      group: string;
      status: string;
      assignedBy: {
        id: string;
        name: string;
        rollNo: string;
      };
    }>;
  };
  departmentStats: Array<{
    _id: string;
    count: number;
  }>;
  weeklyAttendance: Array<{
    _id: string;
    present: number;
    absent: number;
  }>;
}

export interface StudentStats {
  total: number;
  male: number;
  female: number;
  departmentStats: Array<{
    _id: string;
    count: number;
  }>;
  classStats: Array<{
    _id: string;
    count: number;
  }>;
}

export interface AttendanceStats {
  students: {
    present: number;
    absent: number;
    total: number;
  };
  teachers: {
    present: number;
    absent: number;
    total: number;
  };
}

class DashboardService {
  // Get comprehensive dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/dashboard/stats');
      console.log('Dashboard stats fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Get student statistics
  async getStudentStats(): Promise<StudentStats> {
    try {
      const response = await api.get('/dashboard/students');
      return response.data;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      throw error;
    }
  }

  // Get attendance statistics
  async getAttendanceStats(): Promise<AttendanceStats> {
    try {
      const response = await api.get('/dashboard/attendance');
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      throw error;
    }
  }
}

export default new DashboardService(); 