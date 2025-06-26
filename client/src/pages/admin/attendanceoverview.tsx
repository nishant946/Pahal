import React from 'react';
import { useAttendance } from '../../contexts/attendanceContext';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const AttendanceOverview: React.FC = () => {
  const {
    students,
    teachers,
    getStudentAttendanceStats,
    getTeacherAttendanceStats,
  } = useAttendance();

  // For simplicity, show stats for the last 30 days
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Attendance Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Student Attendance</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Attendance % (Last 30 days)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => {
                const stats = getStudentAttendanceStats(student.id, startDate, endDate);
                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{stats?.attendancePercentage?.toFixed(2) ?? 'N/A'}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Teacher Attendance</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Attendance % (Last 30 days)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher: { id: string; name: string; employeeId: string; department: string }) => {
                const stats = getTeacherAttendanceStats(teacher.id, startDate, endDate);
                return (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.employeeId}</TableCell>
                    <TableCell>{teacher.department}</TableCell>
                    <TableCell>{stats?.attendancePercentage?.toFixed(2) ?? 'N/A'}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceOverview;
