import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  RefreshCw,
  UserCheck,
  UserX,
  Calendar as CalendarIcon,
  BarChart3,
  AlertTriangle,
  GraduationCap,
  BookOpen
} from "lucide-react";
import api from '@/services/api';

// Student attendance interfaces
interface StudentAttendanceOverview {
  todayAttendance: number;
  totalStudents: number;
  todayAttendancePercentage: number;
  weeklyAttendance: Array<{ _id: string; count: number }>;
  monthlyAttendance: number;
  monthlyAttendancePercentage: number;
  gradeWiseStats: Array<{
    grade: string;
    present: number;
    total: number;
    percentage: number;
  }>;
  absentToday: number;
}

interface StudentsOnDate {
  present: Array<{
    id: string;
    name: string;
    rollNumber: string;
    grade: string;
    group: string;
    timeMarked: string;
  }>;
  absent: Array<{
    id: string;
    name: string;
    rollNumber: string;
    grade: string;
    group: string;
  }>;
  summary: {
    totalPresent: number;
    totalAbsent: number;
    total: number;
  };
  date: string;
}

// Teacher attendance interfaces
interface TeacherAttendanceOverview {
  todayAttendance: number;
  totalTeachers: number;
  todayAttendancePercentage: number;
  weeklyAttendance: Array<{ _id: string; count: number }>;
  monthlyAttendance: number;
  monthlyAttendancePercentage: number;
  departmentWiseStats: Array<{
    department: string;
    present: number;
    total: number;
    percentage: number;
  }>;
  absentToday: number;
}

interface TeachersOnDate {
  teachers: Array<{
    id: string;
    name: string;
    employeeId: string;
    department: string;
    designation: string;
    email: string;
    phone: string;
    attendance: {
      id: string;
      status: 'present' | 'absent';
      timeMarked: string;
      timeIn?: string;
      timeOut?: string;
    } | null;
  }>;
  statistics: {
    total: number;
    present: number;
    absent: number;
    notMarked: number;
    attendancePercentage: string;
  };
  date: string;
}

type TabType = 'student-overview' | 'student-daily' | 'teacher-overview' | 'teacher-daily';

const AttendanceOverview: React.FC = () => {
  // Student state
  const [studentOverview, setStudentOverview] = useState<StudentAttendanceOverview>({
    todayAttendance: 0,
    totalStudents: 0,
    todayAttendancePercentage: 0,
    weeklyAttendance: [],
    monthlyAttendance: 0,
    monthlyAttendancePercentage: 0,
    gradeWiseStats: [],
    absentToday: 0
  });
  const [studentsOnDate, setStudentsOnDate] = useState<StudentsOnDate | null>(null);

  // Teacher state
  const [teacherOverview, setTeacherOverview] = useState<TeacherAttendanceOverview>({
    todayAttendance: 0,
    totalTeachers: 0,
    todayAttendancePercentage: 0,
    weeklyAttendance: [],
    monthlyAttendance: 0,
    monthlyAttendancePercentage: 0,
    departmentWiseStats: [],
    absentToday: 0
  });
  const [teachersOnDate, setTeachersOnDate] = useState<TeachersOnDate | null>(null);

  // Common state
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<TabType>('student-overview');

  useEffect(() => {
    fetchStudentAttendanceOverview();
    fetchTeacherAttendanceOverview();
  }, []);

  useEffect(() => {
    if (activeTab === 'student-daily') {
      fetchStudentsOnDate();
    } else if (activeTab === 'teacher-daily') {
      fetchTeachersOnDate();
    }
  }, [activeTab, selectedDate]);

  // Student API calls
  const fetchStudentAttendanceOverview = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/attendance/overview');
      setStudentOverview(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch student attendance overview');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsOnDate = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await api.get(`/admin/attendance/students?date=${selectedDate}`);
      setStudentsOnDate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch students for date');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Teacher API calls
  const fetchTeacherAttendanceOverview = async () => {
    try {
      const response = await api.get('/admin/teacher-attendance/overview');
      setTeacherOverview(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teacher attendance overview');
    }
  };

  const fetchTeachersOnDate = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await api.get(`/admin/teacher-attendance/teachers?date=${selectedDate}`);
      setTeachersOnDate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teachers for date');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Mark teacher attendance
  const markTeacherAttendance = async (teacherId: string, status: 'present' | 'absent') => {
    try {
      const timeMarked = new Date().toLocaleTimeString();
      await api.post('/teacher-attendance/mark', {
        teacherId,
        date: selectedDate,
        status,
        timeMarked,
        timeIn: status === 'present' ? timeMarked : undefined
      });
      fetchTeachersOnDate(); // Refresh the data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark teacher attendance');
    }
  };

  // Unmark teacher attendance
  const unmarkTeacherAttendance = async (teacherId: string) => {
    try {
      await api.put('/teacher-attendance/unmark', {
        teacherId,
        date: selectedDate
      });
      fetchTeachersOnDate(); // Refresh the data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unmark teacher attendance');
    }
  };

  const exportTeacherData = () => {
    if (activeTab === 'teacher-daily' && teachersOnDate) {
      const headers = ['Name', 'Employee ID', 'Department', 'Designation', 'Status', 'Time Marked', 'Time In', 'Time Out'];
      const rows = teachersOnDate.teachers.map(teacher => [
        teacher.name,
        teacher.employeeId || '',
        teacher.department || '',
        teacher.designation || '',
        teacher.attendance?.status || 'Not Marked',
        teacher.attendance?.timeMarked || '',
        teacher.attendance?.timeIn || '',
        teacher.attendance?.timeOut || ''
      ]);

      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `teacher-attendance-${selectedDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Overview</h1>
          <p className="text-gray-600 mt-1">Monitor and manage student and teacher attendance</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'teacher-daily' && (
            <Button onClick={exportTeacherData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
          <Button 
            onClick={() => {
              if (activeTab.startsWith('student')) {
                fetchStudentAttendanceOverview();
              } else {
                fetchTeacherAttendanceOverview();
              }
            }} 
            variant="outline" 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b">
        {/* Student Tabs */}
        <div className="flex border-r mr-4 pr-4">
          <span className="text-sm font-medium text-gray-700 self-center mr-3">
            <GraduationCap className="h-4 w-4 inline mr-1" />
            Students:
          </span>
          <button
            onClick={() => setActiveTab('student-overview')}
            className={`px-3 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'student-overview' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('student-daily')}
            className={`px-3 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'student-daily' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarIcon className="h-4 w-4 inline mr-1" />
            Daily View
          </button>
        </div>

        {/* Teacher Tabs */}
        <div className="flex">
          <span className="text-sm font-medium text-gray-700 self-center mr-3">
            <BookOpen className="h-4 w-4 inline mr-1" />
            Teachers:
          </span>
          <button
            onClick={() => setActiveTab('teacher-overview')}
            className={`px-3 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'teacher-overview' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('teacher-daily')}
            className={`px-3 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'teacher-daily' 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CalendarIcon className="h-4 w-4 inline mr-1" />
            Daily View
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <div className="text-red-800">{error}</div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading attendance data...</div>
        </div>
      )}

      {/* Student Overview Tab */}
      {activeTab === 'student-overview' && !loading && (
        <div className="space-y-6">
          {/* Today's Student Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Present Today</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{studentOverview.todayAttendance}</div>
                <p className="text-xs text-gray-600">
                  {studentOverview.todayAttendancePercentage.toFixed(1)}% of total students
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Absent Today</CardTitle>
                <UserX className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{studentOverview.absentToday}</div>
                <p className="text-xs text-gray-600">
                  {((studentOverview.absentToday / studentOverview.totalStudents) * 100).toFixed(1)}% of total students
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentOverview.totalStudents}</div>
                <p className="text-xs text-gray-600">Enrolled students</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Attendance</CardTitle>
                {studentOverview.monthlyAttendancePercentage > 75 ? 
                  <TrendingUp className="h-4 w-4 text-green-500" /> : 
                  <TrendingDown className="h-4 w-4 text-red-500" />
                }
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentOverview.monthlyAttendancePercentage.toFixed(1)}%</div>
                <p className="text-xs text-gray-600">Average this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Grade-wise Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Grade-wise Student Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {studentOverview.gradeWiseStats.map((grade) => (
                  <div key={grade.grade} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Grade {grade.grade}</span>
                      <span className="text-sm text-gray-600">{grade.present}/{grade.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${grade.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{grade.percentage.toFixed(1)}% present</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teacher Overview Tab */}
      {activeTab === 'teacher-overview' && !loading && (
        <div className="space-y-6">
          {/* Today's Teacher Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teachers Present Today</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{teacherOverview.todayAttendance}</div>
                <p className="text-xs text-gray-600">
                  {teacherOverview.todayAttendancePercentage.toFixed(1)}% of total teachers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teachers Absent Today</CardTitle>
                <UserX className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{teacherOverview.absentToday}</div>
                <p className="text-xs text-gray-600">
                  {((teacherOverview.absentToday / teacherOverview.totalTeachers) * 100).toFixed(1)}% of total teachers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherOverview.totalTeachers}</div>
                <p className="text-xs text-gray-600">Active teachers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Attendance</CardTitle>
                {teacherOverview.monthlyAttendancePercentage > 75 ? 
                  <TrendingUp className="h-4 w-4 text-green-500" /> : 
                  <TrendingDown className="h-4 w-4 text-red-500" />
                }
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherOverview.monthlyAttendancePercentage.toFixed(1)}%</div>
                <p className="text-xs text-gray-600">Average this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Department-wise Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Department-wise Teacher Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teacherOverview.departmentWiseStats.map((dept) => (
                  <div key={dept.department} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{dept.department || 'Unassigned'}</span>
                      <span className="text-sm text-gray-600">{dept.present}/{dept.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{dept.percentage.toFixed(1)}% present</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teacher Daily View Tab */}
      {activeTab === 'teacher-daily' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Button onClick={fetchTeachersOnDate} disabled={analyticsLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Teachers
              </Button>
            </div>
          </div>

          {teachersOnDate && (
            <div className="space-y-4">
              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{teachersOnDate.statistics.total}</div>
                    <p className="text-sm text-gray-600">Total Teachers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{teachersOnDate.statistics.present}</div>
                    <p className="text-sm text-gray-600">Present</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">{teachersOnDate.statistics.absent}</div>
                    <p className="text-sm text-gray-600">Absent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">{teachersOnDate.statistics.notMarked}</div>
                    <p className="text-sm text-gray-600">Not Marked</p>
                  </CardContent>
                </Card>
              </div>

              {/* Teachers Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Attendance for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time Marked</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachersOnDate.teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.employeeId || '-'}</TableCell>
                          <TableCell>{teacher.department || '-'}</TableCell>
                          <TableCell>{teacher.designation || '-'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              teacher.attendance?.status === 'present' 
                                ? 'bg-green-100 text-green-800' 
                                : teacher.attendance?.status === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {teacher.attendance?.status || 'Not Marked'}
                            </span>
                          </TableCell>
                          <TableCell>{teacher.attendance?.timeMarked || '-'}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {!teacher.attendance && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => markTeacherAttendance(teacher.id, 'present')}
                                    className="text-green-600 hover:bg-green-50"
                                  >
                                    Present
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => markTeacherAttendance(teacher.id, 'absent')}
                                    className="text-red-600 hover:bg-red-50"
                                  >
                                    Absent
                                  </Button>
                                </>
                              )}
                              {teacher.attendance && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => unmarkTeacherAttendance(teacher.id)}
                                  className="text-gray-600 hover:bg-gray-50"
                                >
                                  Unmark
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Student Daily View Tab */}
      {activeTab === 'student-daily' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <Button onClick={fetchStudentsOnDate} disabled={analyticsLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Students
              </Button>
            </div>
          </div>

          {studentsOnDate && (
            <div className="space-y-4">
              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold">{studentsOnDate.summary.total}</div>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{studentsOnDate.summary.totalPresent}</div>
                    <p className="text-sm text-gray-600">Present</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-red-600">{studentsOnDate.summary.totalAbsent}</div>
                    <p className="text-sm text-gray-600">Absent</p>
                  </CardContent>
                </Card>
              </div>

              {/* Present Students Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Present Students - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Time Marked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsOnDate.present.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>{student.grade}</TableCell>
                          <TableCell>{student.group}</TableCell>
                          <TableCell>{student.timeMarked}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceOverview;