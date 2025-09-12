import api from './api';

interface AdminProfileUpdateData {
  name: string;
  email: string;
  mobileNo: string;
  department?: string;
  designation?: string;
  qualification?: string;
  adminLevel?: string;
  avatar?: string;
}

interface AdminProfileResponse {
  success: boolean;
  data: any;
  message: string;
}

class AdminProfileService {
  async updateProfile(profileData: AdminProfileUpdateData): Promise<AdminProfileResponse> {
    try {
      const response = await api.put('/admin/profile', profileData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async uploadAvatar(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/admin/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.avatarUrl;
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<AdminProfileResponse> {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<AdminProfileResponse> {
    try {
      const response = await api.put('/admin/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async updateSecurity(securityData: any): Promise<AdminProfileResponse> {
    try {
      const response = await api.put('/admin/security-settings', securityData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

const adminProfileService = new AdminProfileService();
export default adminProfileService;