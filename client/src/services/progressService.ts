import axios from "axios";


export const getStudents = async () => {
  const token = localStorage.getItem('teacherToken');
  if (!token) throw new Error('No teacher token found. Please login again.');
  const res = await axios.get("/api/v1/student/all", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


export const getStudentProgress = async (studentId: string) => {
  const token = localStorage.getItem('teacherToken');
  if (!token) throw new Error('No teacher token found. Please login again.');
  const res = await axios.get(`/api/v1/progress/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


export const updateStudentProgress = async (studentId: string, progress: string, mentor?: string) => {
  const token = localStorage.getItem('teacherToken');
  if (!token) throw new Error('No teacher token found. Please login again.');
  const res = await axios.post(
    `/api/v1/progress/${studentId}`,
    mentor ? { progress, mentor } : { progress },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
