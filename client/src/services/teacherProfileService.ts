import api from './api';

export interface ProfileUpdateData {
  name: string;
  email: string;
  mobileNo: string;
  department: string;
  designation: string;
  qualification: string;
  preferredDays: string[];
  subjectChoices: string[];
  avatar?: string;
}

class TeacherProfileService {
  async updateProfile(data: ProfileUpdateData): Promise<any> {
    try {
      const response = await api.put('/teacher/profile', data);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/teacher/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.avatarUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<any> {
    try {
      const response = await api.get('/teacher/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
}

const teacherProfileService = new TeacherProfileService();
export default teacherProfileService;
