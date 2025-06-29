import api from './api';

export interface Homework {
  id: string;
  group: 'A' | 'B' | 'C';
  subject: string;
  description: string;
  dueDate: string;
  dateAssigned: string;
  status: 'pending' | 'completed';
  assignedBy?: {
    id: string;
    name: string;
    employeeId: string;
    department: string;
  };
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface HomeworkStats {
  total: number;
  pending: number;
  completed: number;
  groupStats: Array<{
    _id: string;
    count: number;
    pending: number;
    completed: number;
  }>;
}

// Helper function to transform MongoDB document to frontend format
const transformHomework = (data: any): Homework => {
  return {
    id: data._id || data.id,
    group: data.group,
    subject: data.subject,
    description: data.description,
    dueDate: data.dueDate,
    dateAssigned: data.dateAssigned,
    status: data.status,
    assignedBy: data.assignedBy ? {
      id: data.assignedBy._id || data.assignedBy.id,
      name: data.assignedBy.name,
      employeeId: data.assignedBy.employeeId,
      department: data.assignedBy.department
    } : undefined,
    attachments: data.attachments,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

class HomeworkService {
  // Create new homework
  async createHomework(homeworkData: {
    group: 'A' | 'B' | 'C';
    subject: string;
    description: string;
    dueDate: string;
    assignedBy: string;
  }): Promise<Homework> {
    try {
      const response = await api.post('/homework', homeworkData);
      return transformHomework(response.data);
    } catch (error) {
      console.error('Error creating homework:', error);
      throw error;
    }
  }

  // Get all homework
  async getAllHomework(): Promise<Homework[]> {
    try {
      const response = await api.get('/homework');
      return response.data.map(transformHomework);
    } catch (error) {
      console.error('Error fetching homework:', error);
      throw error;
    }
  }

  // Get homework by group
  async getHomeworkByGroup(group: 'A' | 'B' | 'C'): Promise<Homework[]> {
    try {
      const response = await api.get(`/homework/group/${group}`);
      return response.data.map(transformHomework);
    } catch (error) {
      console.error('Error fetching homework by group:', error);
      throw error;
    }
  }

  // Get homework by teacher
  async getHomeworkByTeacher(teacherId: string): Promise<Homework[]> {
    try {
      const response = await api.get(`/homework/teacher/${teacherId}`);
      return response.data.map(transformHomework);
    } catch (error) {
      console.error('Error fetching homework by teacher:', error);
      throw error;
    }
  }

  // Get recent homework (today)
  async getRecentHomework(): Promise<Homework[]> {
    try {
      const response = await api.get('/homework/recent');
      return response.data.map(transformHomework);
    } catch (error) {
      console.error('Error fetching recent homework:', error);
      throw error;
    }
  }

  // Get yesterday's homework
  async getYesterdayHomework(): Promise<Homework[]> {
    try {
      const response = await api.get('/homework/yesterday');
      return response.data.map(transformHomework);
    } catch (error) {
      console.error('Error fetching yesterday\'s homework:', error);
      throw error;
    }
  }

  // Get homework statistics
  async getHomeworkStats(): Promise<HomeworkStats> {
    try {
      const response = await api.get('/homework/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching homework stats:', error);
      throw error;
    }
  }

  // Update homework
  async updateHomework(id: string, updateData: Partial<Homework>): Promise<Homework> {
    try {
      const response = await api.put(`/homework/${id}`, updateData);
      return transformHomework(response.data);
    } catch (error) {
      console.error('Error updating homework:', error);
      throw error;
    }
  }

  // Delete homework
  async deleteHomework(id: string): Promise<void> {
    try {
      await api.delete(`/homework/${id}`);
    } catch (error) {
      console.error('Error deleting homework:', error);
      throw error;
    }
  }
}

export default new HomeworkService(); 