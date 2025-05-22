import api from './api';

export interface TeacherLoginCredentials {
  employeeId: string;
  password: string;
}

export interface TeacherAuthResponse {
  token: string;
  teacher: {
    id: string;
    name: string;
    employeeId: string;
    department: string;
    email: string;
    designation: string;
  };
}

export async function loginTeacher(credentials: TeacherLoginCredentials) {
  try {
    const response = await api.post<TeacherAuthResponse>('/auth/teacher/login', credentials);
    if (response.data.token) {
      localStorage.setItem('teacherToken', response.data.token);
      localStorage.setItem('teacherData', JSON.stringify(response.data.teacher));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export function logoutTeacher() {
  localStorage.removeItem('teacherToken');
  localStorage.removeItem('teacherData');
}

export function getTeacherToken(): string | null {
  return localStorage.getItem('teacherToken');
}

export function getCurrentTeacher() {
  const teacherData = localStorage.getItem('teacherData');
  return teacherData ? JSON.parse(teacherData) : null;
}

export function isTeacherAuthenticated(): boolean {
  return !!getTeacherToken();
}
