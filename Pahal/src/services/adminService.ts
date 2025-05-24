import axios from 'axios';

const BASE_URL = '/api/admin';

export interface TeacherData {
  name: string;
  email: string;
  subject: string;
  documents?: File[];
}

export interface DashboardStats {
  totalTeachers: number;
  pendingVerifications: number;
  totalCourses: number;
  activeStudents: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await axios.get(`${BASE_URL}/dashboard/stats`);
    return response.data;
  }

  async getAllTeachers() {
    const response = await axios.get(`${BASE_URL}/teachers`);
    return response.data;
  }

  async getVerificationRequests() {
    const response = await axios.get(`${BASE_URL}/teachers/verification-requests`);
    return response.data;
  }

  async verifyTeacher(teacherId: string) {
    const response = await axios.post(`${BASE_URL}/teachers/${teacherId}/verify`);
    return response.data;
  }

  async rejectTeacher(teacherId: string, reason: string) {
    const response = await axios.post(`${BASE_URL}/teachers/${teacherId}/reject`, { reason });
    return response.data;
  }

  async addTeacher(teacherData: TeacherData) {
    const formData = new FormData();
    Object.entries(teacherData).forEach(([key, value]) => {
      if (key === 'documents' && value) {
        (value as File[]).forEach(file => {
          formData.append('documents', file);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await axios.post(`${BASE_URL}/teachers`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateTeacher(teacherId: string, teacherData: Partial<TeacherData>) {
    const response = await axios.put(`${BASE_URL}/teachers/${teacherId}`, teacherData);
    return response.data;
  }

  async deleteTeacher(teacherId: string) {
    const response = await axios.delete(`${BASE_URL}/teachers/${teacherId}`);
    return response.data;
  }

  async getTeacherDetails(teacherId: string) {
    const response = await axios.get(`${BASE_URL}/teachers/${teacherId}`);
    return response.data;
  }

  // Course management
  async getAllCourses() {
    const response = await axios.get(`${BASE_URL}/courses`);
    return response.data;
  }

  async addCourse(courseData: any) {
    const response = await axios.post(`${BASE_URL}/courses`, courseData);
    return response.data;
  }

  // Attendance management
  async getAttendanceOverview() {
    const response = await axios.get(`${BASE_URL}/attendance/overview`);
    return response.data;
  }

  // Reports
  async generateReport(reportType: string, filters: any) {
    const response = await axios.post(`${BASE_URL}/reports/${reportType}`, filters);
    return response.data;
  }
}

export const adminService = new AdminService();
