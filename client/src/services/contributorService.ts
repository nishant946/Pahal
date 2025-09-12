import api from './api';

export interface Contributor {
  _id: string;
  name: string;
  role: string;
  description: string;
  image?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  email?: string;
  batch?: string;
  branch?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContributorFormData {
  name: string;
  role: string;
  description: string;
  image?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  email?: string;
  batch?: string;
  branch?: string;
  order: number;
  isActive: boolean;
}

// Get all contributors (public endpoint)
export const getContributors = async (): Promise<Contributor[]> => {
  try {
    const response = await api.get('/contributors');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching contributors:', error);
    throw error;
  }
};

// Get all contributors for admin (includes inactive)
export const getContributorsAdmin = async (): Promise<Contributor[]> => {
  try {
    const response = await api.get('/contributors/admin/all');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching contributors for admin:', error);
    throw error;
  }
};

// Get contributor by ID
export const getContributorById = async (id: string): Promise<Contributor> => {
  try {
    const response = await api.get(`/contributors/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching contributor:', error);
    throw error;
  }
};

// Create new contributor (admin only)
export const createContributor = async (data: ContributorFormData): Promise<Contributor> => {
  try {
    const response = await api.post('/contributors', data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating contributor:', error);
    throw error;
  }
};

// Update contributor (admin only)
export const updateContributor = async (id: string, data: Partial<ContributorFormData>): Promise<Contributor> => {
  try {
    const response = await api.put(`/contributors/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating contributor:', error);
    throw error;
  }
};

// Delete contributor (admin only)
export const deleteContributor = async (id: string): Promise<void> => {
  try {
    await api.delete(`/contributors/${id}`);
  } catch (error) {
    console.error('Error deleting contributor:', error);
    throw error;
  }
};

// Toggle contributor status (admin only)
export const toggleContributorStatus = async (id: string): Promise<Contributor> => {
  try {
    const response = await api.patch(`/contributors/${id}/toggle-status`);
    return response.data.data;
  } catch (error) {
    console.error('Error toggling contributor status:', error);
    throw error;
  }
};