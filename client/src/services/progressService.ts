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

export const getStudents = async () => {
  try {
    const response = await api.get('/student/all');
    if (Array.isArray(response.data)) {
      return response.data.map(transformStudent);
    } else if (Array.isArray(response.data.students)) {
      return response.data.students.map(transformStudent);
    } else {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getStudentProgress = async (studentId: string) => {
  try {
    const response = await api.get(`/progress/${studentId}`);
    return Array.isArray(response.data)
      ? response.data.map(transformProgressLog)
      : response.data;
  } catch (error) {
    console.error('Error fetching student progress:', error);
    throw error;
  }
};

export const updateStudentProgress = async (studentId: string, progress: string, mentor?: string) => {
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
};

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
