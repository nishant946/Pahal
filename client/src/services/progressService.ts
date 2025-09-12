import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";


export const getStudents = async () => {
  const token = localStorage.getItem('teacherToken');
  if (!token) throw new Error('No teacher token found. Please login again.');
  const res = await axios.get(`${API_BASE_URL}/api/v1/student/all`, { 
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


export const getStudentProgress = async (studentId: string) => {
  const token = localStorage.getItem('teacherToken');
  if (!token) throw new Error('No teacher token found. Please login again.');
  const res = await axios.get(`${API_BASE_URL}/api/v1/progress/${studentId}`, { 
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


export const updateStudentProgress = async (studentId: string, progress: string, mentor?: string) => {
  const token = localStorage.getItem('teacherToken');
  if (!token) throw new Error('No teacher token found. Please login again.');
  const res = await axios.post(`${API_BASE_URL}/api/v1/progress/${studentId}`, mentor ? { progress, mentor } : { progress }, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

import api from './api';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  mentor?: string;
}

export interface ProgressLog {
  _id: string;
  studentId: string;
  teacherId: string;
  teacherName: string;
  progress: string;
  mentor?: string;
  timestamp: string;
}

// Helper function to transform MongoDB document to frontend format
const transformStudent = (data: any): Student => ({
  id: data._id || data.id,
  name: data.name,
  rollNumber: data.rollNumber,
  mentor: data.mentor,
});

const transformProgressLog = (data: any): ProgressLog => ({
  _id: data._id,
  studentId: data.studentId,
  teacherId: data.teacherId,
  teacherName: data.teacherName,
  progress: data.progress,
  mentor: data.mentor,
  timestamp: data.timestamp,
});

class ProgressService {
  async getStudents(): Promise<Student[]> {
    try {
      const response = await api.get('/student/all');
      if (Array.isArray(response.data)) {
        return response.data.map(transformStudent);
      } else if (Array.isArray(response.data.students)) {
        return response.data.students.map(transformStudent);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async getStudentProgress(studentId: string): Promise<ProgressLog[]> {
    try {
      const response = await api.get(`/progress/${studentId}`);
      return Array.isArray(response.data)
        ? response.data.map(transformProgressLog)
        : [];
    } catch (error) {
      console.error('Error fetching student progress:', error);
      throw error;
    }
  }

  async updateStudentProgress(studentId: string, progress: string, mentor?: string): Promise<ProgressLog> {
    try {
      const response = await api.post(
        `/progress/${studentId}`,
        mentor ? { progress, mentor } : { progress }
      );
      return transformProgressLog(response.data);
    } catch (error) {
      console.error('Error updating student progress:', error);
      throw error;
    }
  }
}

export default new ProgressService();
