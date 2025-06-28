import api from './api';

export interface Teacher {
  id: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAttendance {
  id: string;
  teacher: Teacher;
  date: string;
  status: 'present' | 'absent';
  timeMarked: string;
  timeIn?: string;
  timeOut?: string;
  notes?: string;
}

export interface TeacherAttendanceStats {
  total: number;
  present: number;
  absent: number;
  attendancePercentage: number;
}

export interface TeacherAttendanceReport {
  startDate: string;
  endDate: string;
  teachers: Array<Teacher & TeacherAttendanceStats>;
}

export interface TeacherStats {
  total: number;
  verified: number;
  unverified: number;
  departmentStats: Array<{
    _id: string;
    count: number;
  }>;
}

class TeacherService {
  // Get all teachers
  async getAllTeachers(): Promise<Teacher[]> {
    try {
      const response = await api.get('/teacher');
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  }

  // Get teacher by ID
  async getTeacherById(id: string): Promise<Teacher> {
    try {
      const response = await api.get(`/teacher/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw error;
    }
  }

  // Get teachers by department
  async getTeachersByDepartment(department: string): Promise<Teacher[]> {
    try {
      const response = await api.get(`/teacher/department/${department}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers by department:', error);
      throw error;
    }
  }

  // Get teacher statistics
  async getTeacherStats(): Promise<TeacherStats> {
    try {
      const response = await api.get('/teacher/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
      throw error;
    }
  }

  // Register new teacher
  async registerTeacher(teacherData: {
    rollNo: string;
    name: string;
    mobileNo: string;
    email: string;
    department: string;
    preferredDays: string[];
    subjectChoices: string[];
    designation?: string;
    qualification?: string;
    password: string;
  }): Promise<Teacher> {
    try {
      const response = await api.post('/teacher/register', teacherData);
      return response.data.teacher;
    } catch (error) {
      console.error('Error registering teacher:', error);
      throw error;
    }
  }

  // Update teacher
  async updateTeacher(id: string, updateData: Partial<Teacher>): Promise<Teacher> {
    try {
      const response = await api.put(`/teacher/${id}`, updateData);
      return response.data.teacher;
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw error;
    }
  }

  // Delete teacher
  async deleteTeacher(id: string): Promise<void> {
    try {
      await api.delete(`/teacher/${id}`);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw error;
    }
  }

  // Verify teacher
  async verifyTeacher(id: string): Promise<Teacher> {
    try {
      const response = await api.patch(`/teacher/${id}/verify`);
      return response.data.teacher;
    } catch (error) {
      console.error('Error verifying teacher:', error);
      throw error;
    }
  }

  // Get teacher attendance
  async getTeacherAttendance(teacherId: string): Promise<any[]> {
    try {
      const response = await api.get(`/teacher-attendance/${teacherId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher attendance:', error);
      throw error;
    }
  }

  // Mark teacher attendance
  async markTeacherAttendance(attendanceData: {
    teacherId: string;
    date: string;
    status: 'present' | 'absent';
    timeMarked: string;
    timeIn?: string;
    timeOut?: string;
    notes?: string;
  }): Promise<TeacherAttendance> {
    try {
      const response = await api.post('/teacher-attendance/mark', attendanceData);
      return response.data;
    } catch (error) {
      console.error('Error marking teacher attendance:', error);
      throw error;
    }
  }

  // Get present teachers by date
  async getPresentTeachersByDate(date: string): Promise<{
    date: string;
    presentTeachers: Array<{
      id: string;
      name: string;
      employeeId: string;
      department: string;
      designation: string;
      timeMarked: string;
      timeIn?: string;
    }>;
  }> {
    try {
      const response = await api.get(`/teacher-attendance/date?date=${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching present teachers:', error);
      throw error;
    }
  }

  // Get teacher attendance stats
  async getTeacherAttendanceStats(
    teacherId: string,
    startDate: string,
    endDate: string
  ): Promise<TeacherAttendanceStats> {
    try {
      const response = await api.get(
        `/teacher-attendance/stats/${teacherId}?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher attendance stats:', error);
      throw error;
    }
  }

  // Get all teachers attendance report
  async getAllTeachersAttendanceReport(
    startDate: string,
    endDate: string
  ): Promise<TeacherAttendanceReport> {
    try {
      const response = await api.get(
        `/teacher-attendance/report?startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all teachers attendance report:', error);
      throw error;
    }
  }

  // Unmark teacher attendance
  async unmarkTeacherAttendance(teacherId: string, date: string): Promise<void> {
    try {
      await api.put('/teacher-attendance/unmark', { teacherId, date });
    } catch (error) {
      console.error('Error unmarking teacher attendance:', error);
      throw error;
    }
  }

  // Update teacher attendance
  async updateTeacherAttendance(
    attendanceId: string,
    updateData: {
      status?: 'present' | 'absent';
      timeIn?: string;
      timeOut?: string;
      notes?: string;
    }
  ): Promise<TeacherAttendance> {
    try {
      const response = await api.put(`/teacher-attendance/${attendanceId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating teacher attendance:', error);
      throw error;
    }
  }
}

export default new TeacherService(); 