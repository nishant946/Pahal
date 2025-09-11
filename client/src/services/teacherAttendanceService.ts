import api from './api';

export const markTeacherAttendance = async (data: {
  teacherId: string;
  date: string;
  status: 'present' | 'absent';
  timeMarked: string;
  timeIn?: string;
  timeOut?: string;
  notes?: string;
}) => {
  return api.post('/teacher-attendance/mark', data);
};

export const unmarkTeacherAttendance = async (teacherId: string, date: string) => {
  return api.put('/teacher-attendance/unmark', { teacherId, date });
};

export const updateTeacherAttendance = async (attendanceId: string, data: {
  status?: 'present' | 'absent';
  timeIn?: string;
  timeOut?: string;
  notes?: string;
}) => {
  return api.put(`/teacher-attendance/${attendanceId}`, data);
};

export const getTeacherAttendance = async (teacherId: string) => {
  return api.get(`/teacher-attendance/${teacherId}`);
};

export const getPresentTeachersByDate = async (date: string) => {
  return api.get(`/teacher-attendance/date?date=${date}`);
};

export const getTeacherAttendanceStats = async (teacherId: string, startDate: string, endDate: string) => {
  return api.get(`/teacher-attendance/stats/${teacherId}?startDate=${startDate}&endDate=${endDate}`);
};

export const getAllTeachersAttendanceReport = async (startDate: string, endDate: string) => {
  return api.get(`/teacher-attendance/report?startDate=${startDate}&endDate=${endDate}`);
};
