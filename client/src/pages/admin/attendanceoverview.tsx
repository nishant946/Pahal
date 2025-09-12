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
  Filter,
  RefreshCw,
  UserCheck,
  UserX,
  Calendar as CalendarIcon,
  BarChart3,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import api from '@/services/api';

interface AttendanceOverview {
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

interface AttendanceAnalytics {
  dailyTrend: Array<{
    _id: string;
    present: number;
    absent: number;
  }>;
  lowAttendanceStudents: Array<{
    studentName: string;
    rollNumber: string;
    grade: string;
    totalDays: number;
    presentDays: number;
    attendancePercentage: number;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

interface TeacherAttendanceAnalytics {
  dailyTrend: Array<{
    _id: string;
    present: number;
    absent: number;
  }>;
  lowAttendanceTeachers: Array<{
    name: string;
    employeeId: string;
    department: string;
    totalDays: number;
    presentDays: number;
    attendancePercentage: number;
  }>;
  departmentStats: Array<{
    department: string;
    attendanceRate: number;
    totalRecords: number;
    presentCount: number;
  }>;
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

interface TeachersOnDate {
  teachers: Array<{
    id: string;
    name: string;
    employeeId: string;
    department: string;
    designation: string;
    status: 'present' | 'absent';
    timeMarked: string | null;
    timeIn: string | null;
    timeOut: string | null;
  }>;
}

const AttendanceOverview: React.FC = () => {
  // Main attendance type tab (students vs teachers)
  const [attendanceType, setAttendanceType] = useState<'students' | 'teachers'>('students');
  
  // Student attendance state
  const [overview, setOverview] = useState<AttendanceOverview>({
    todayAttendance: 0,
    totalStudents: 0,
    todayAttendancePercentage: 0,
    weeklyAttendance: [],
    monthlyAttendance: 0,
    monthlyAttendancePercentage: 0,
    gradeWiseStats: [],
    absentToday: 0
  });
  const [analytics, setAnalytics] = useState<AttendanceAnalytics | null>(null);
  const [studentsOnDate, setStudentsOnDate] = useState<StudentsOnDate | null>(null);
  
  // Teacher attendance state
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
  const [teacherAnalytics, setTeacherAnalytics] = useState<TeacherAttendanceAnalytics | null>(null);
  const [teachersOnDate, setTeachersOnDate] = useState<TeachersOnDate | null>(null);
  
  // Common state
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'daily'>('overview');

  useEffect(() => {
    if (attendanceType === 'students') {
      fetchAttendanceOverview();
    } else {
      fetchTeacherAttendanceOverview();
    }
  }, [attendanceType]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      if (attendanceType === 'students') {
        fetchAttendanceAnalytics();
      } else {
        fetchTeacherAttendanceAnalytics();
      }
    } else if (activeTab === 'daily') {
      if (attendanceType === 'students') {
        fetchStudentsOnDate();
      } else {
        fetchTeachersOnDate();
      }
    }
  }, [activeTab, dateRange, selectedGrade, selectedDepartment, selectedDate, attendanceType]);

  const fetchAttendanceOverview = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/attendance/overview');
      setOverview(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance overview');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAttendanceOverview = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/teacher-attendance/overview');
      setTeacherOverview(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teacher attendance overview');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        ...(selectedGrade !== 'all' && { grade: selectedGrade })
      });
      const response = await api.get(`/admin/attendance/analytics?${params}`);
      setAnalytics(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchTeacherAttendanceAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        ...(selectedDepartment !== 'all' && { department: selectedDepartment })
      });
      const response = await api.get(`/admin/teacher-attendance/analytics?${params}`);
      setTeacherAnalytics(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teacher attendance analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchStudentsOnDate = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await api.get(`/admin/attendance/students?date=${selectedDate}`);
      setStudentsOnDate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch students data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchTeachersOnDate = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await api.get(`/admin/teacher-attendance/teachers?date=${selectedDate}`);
      setTeachersOnDate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teachers data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const exportAttendanceData = () => {
    if (activeTab === 'daily') {
      if (attendanceType === 'students' && studentsOnDate) {
        const data = [
          ['Date', 'Student Name', 'Roll Number', 'Grade', 'Group', 'Status', 'Time Marked'],
          ...studentsOnDate.present.map(student => [
            selectedDate, student.name, student.rollNumber, student.grade, student.group, 'Present', student.timeMarked
          ]),
          ...studentsOnDate.absent.map(student => [
            selectedDate, student.name, student.rollNumber, student.grade, student.group, 'Absent', ''
          ])
        ];
        
        const csvContent = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student_attendance_${selectedDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else if (attendanceType === 'teachers' && teachersOnDate) {
        const data = [
          ['Date', 'Teacher Name', 'Employee ID', 'Department', 'Designation', 'Status', 'Time Marked', 'Time In', 'Time Out'],
          ...teachersOnDate.teachers.map(teacher => [
            selectedDate, teacher.name, teacher.employeeId, teacher.department, teacher.designation, 
            teacher.status, teacher.timeMarked || '', teacher.timeIn || '', teacher.timeOut || ''
          ])
        ];
        
        const csvContent = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `teacher_attendance_${selectedDate}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Overview</h1>
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Loading attendance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze attendance across the institution</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => attendanceType === 'students' ? fetchAttendanceOverview() : fetchTeacherAttendanceOverview()} 
            variant="outline" 
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          {activeTab === 'daily' && (
            <Button onClick={exportAttendanceData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Main Attendance Type Tabs */}
      <div className="flex border-b-2 border-gray-200">
        <button
          onClick={() => setAttendanceType('students')}
          className={`px-6 py-3 font-semibold text-sm flex items-center ${
            attendanceType === 'students' 
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          Student Attendance
        </button>
        <button
          onClick={() => setAttendanceType('teachers')}
          className={`px-6 py-3 font-semibold text-sm flex items-center ${
            attendanceType === 'teachers' 
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="h-5 w-5 mr-2" />
          Teacher Attendance
        </button>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'overview' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-1" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'analytics' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-1" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 border-b-2 font-medium text-sm ${
            activeTab === 'daily' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <CalendarIcon className="h-4 w-4 inline mr-1" />
          Daily View
        </button>
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Today's Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {attendanceType === 'students' ? overview.todayAttendance : teacherOverview.todayAttendance}
                </div>
                <p className="text-xs text-gray-600">
                  {(attendanceType === 'students' ? overview.todayAttendancePercentage : teacherOverview.todayAttendancePercentage).toFixed(1)}% attendance rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
                <UserX className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {attendanceType === 'students' ? overview.absentToday : teacherOverview.absentToday}
                </div>
                <p className="text-xs text-gray-600">
                  {attendanceType === 'students' 
                    ? ((overview.absentToday / overview.totalStudents) * 100).toFixed(1)
                    : ((teacherOverview.absentToday / teacherOverview.totalTeachers) * 100).toFixed(1)
                  }% absent rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total {attendanceType === 'students' ? 'Students' : 'Teachers'}
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {attendanceType === 'students' ? overview.totalStudents : teacherOverview.totalTeachers}
                </div>
                <p className="text-xs text-gray-600">
                  {attendanceType === 'students' ? 'Enrolled students' : 'Active teachers'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
                {(attendanceType === 'students' ? overview.monthlyAttendancePercentage : teacherOverview.monthlyAttendancePercentage) >= 80 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  (attendanceType === 'students' ? overview.monthlyAttendancePercentage : teacherOverview.monthlyAttendancePercentage) >= 80 ? 'text-green-600' : 
                  (attendanceType === 'students' ? overview.monthlyAttendancePercentage : teacherOverview.monthlyAttendancePercentage) >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {(attendanceType === 'students' ? overview.monthlyAttendancePercentage : teacherOverview.monthlyAttendancePercentage).toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600">
                  {overview.monthlyAttendancePercentage >= 80 ? 'Excellent' : 
                   overview.monthlyAttendancePercentage >= 60 ? 'Good' : 'Needs attention'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Grade-wise Attendance */}
          <Card>
            <CardHeader>
              <CardTitle>
                {attendanceType === 'students' ? 'Grade-wise Attendance (Today)' : 'Department-wise Attendance (Today)'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(attendanceType === 'students' ? overview.gradeWiseStats : teacherOverview.departmentWiseStats).length > 0 ? (
                <div className="space-y-4">
                  {attendanceType === 'students' ? (
                    overview.gradeWiseStats.map((item) => (
                      <div key={item.grade} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Grade {item.grade}</p>
                          <p className="text-sm text-gray-600">
                            {item.present} out of {item.total} students
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            item.percentage >= 80 ? 'text-green-600' : 
                            item.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.percentage.toFixed(1)}%
                          </p>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                item.percentage >= 80 ? 'bg-green-500' : 
                                item.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    teacherOverview.departmentWiseStats.map((item) => (
                      <div key={item.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.department}</p>
                          <p className="text-sm text-gray-600">
                            {item.present} out of {item.total} teachers
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${
                            item.percentage >= 80 ? 'text-green-600' : 
                            item.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.percentage.toFixed(1)}%
                          </p>
                          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`h-2 rounded-full ${
                                item.percentage >= 80 ? 'bg-green-500' : 
                                item.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No attendance data available for today
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {overview.weeklyAttendance.length > 0 ? (
                <div className="space-y-3">
                  {overview.weeklyAttendance.map((day) => (
                    <div key={day._id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{day._id}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min((day.count / overview.totalStudents) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-16 text-right">
                          {day.count} students
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No weekly data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Analytics Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {attendanceType === 'students' ? 'Grade Filter' : 'Department Filter'}
                  </label>
                  {attendanceType === 'students' ? (
                    <select 
                      value={selectedGrade} 
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Grades</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                    </select>
                  ) : (
                    <select 
                      value={selectedDepartment} 
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Departments</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="Social Studies">Social Studies</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Physical Education">Physical Education</option>
                      <option value="Arts">Arts</option>
                    </select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {analyticsLoading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading analytics...</span>
            </div>
          ) : (attendanceType === 'students' ? analytics : teacherAnalytics) ? (
            <>
              {/* Low Attendance Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    {attendanceType === 'students' 
                      ? 'Students with Low Attendance (< 75%)' 
                      : 'Teachers with Low Attendance (< 80%)'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(attendanceType === 'students' 
                    ? analytics?.lowAttendanceStudents 
                    : teacherAnalytics?.lowAttendanceTeachers
                  )?.length ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{attendanceType === 'students' ? 'Student Name' : 'Teacher Name'}</TableHead>
                          <TableHead>{attendanceType === 'students' ? 'Roll Number' : 'Employee ID'}</TableHead>
                          <TableHead>{attendanceType === 'students' ? 'Grade' : 'Department'}</TableHead>
                          <TableHead>Present Days</TableHead>
                          <TableHead>Total Days</TableHead>
                          <TableHead>Attendance %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceType === 'students' 
                          ? analytics!.lowAttendanceStudents.map((student, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{student.studentName}</TableCell>
                                <TableCell>{student.rollNumber}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>{student.presentDays}</TableCell>
                                <TableCell>{student.totalDays}</TableCell>
                                <TableCell>
                                  <span className={`font-bold ${
                                    student.attendancePercentage < 60 ? 'text-red-600' : 'text-yellow-600'
                                  }`}>
                                    {student.attendancePercentage}%
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          : teacherAnalytics!.lowAttendanceTeachers.map((teacher, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                <TableCell>{teacher.employeeId}</TableCell>
                                <TableCell>{teacher.department}</TableCell>
                                <TableCell>{teacher.presentDays}</TableCell>
                                <TableCell>{teacher.totalDays}</TableCell>
                                <TableCell>
                                  <span className={`font-bold ${
                                    teacher.attendancePercentage < 60 ? 'text-red-600' : 'text-yellow-600'
                                  }`}>
                                    {teacher.attendancePercentage}%
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                        }
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No {attendanceType === 'students' ? 'students' : 'teachers'} with low attendance in the selected period
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Daily Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Attendance Trend</CardTitle>
                  <p className="text-sm text-gray-600">
                    From {dateRange.start} to {dateRange.end}
                  </p>
                </CardHeader>
                <CardContent>
                  {(attendanceType === 'students' ? analytics?.dailyTrend : teacherAnalytics?.dailyTrend)?.length ? (
                    <div className="space-y-3">
                      {(attendanceType === 'students' ? analytics!.dailyTrend : teacherAnalytics!.dailyTrend).map((day) => (
                        <div key={day._id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{day._id}</span>
                            <span className="text-gray-600">
                              Present: {day.present} | Absent: {day.absent}
                            </span>
                          </div>
                          <div className="flex h-4 bg-gray-200 rounded">
                            <div 
                              className="bg-green-500 rounded-l"
                              style={{ 
                                width: `${(day.present / (day.present + day.absent)) * 100}%` 
                              }}
                            ></div>
                            <div 
                              className="bg-red-500 rounded-r"
                              style={{ 
                                width: `${(day.absent / (day.present + day.absent)) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No trend data available for the selected period
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {/* Daily View Tab */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Date Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1 max-w-xs">
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => attendanceType === 'students' ? fetchStudentsOnDate() : fetchTeachersOnDate()} 
                  disabled={analyticsLoading}
                >
                  {analyticsLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <CalendarIcon className="h-4 w-4 mr-1" />
                  )}
                  Load Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {analyticsLoading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-600">Loading daily data...</span>
            </div>
          ) : (attendanceType === 'students' ? studentsOnDate : teachersOnDate) ? (
            <>
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Present</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {attendanceType === 'students' 
                        ? studentsOnDate!.summary.totalPresent 
                        : teachersOnDate!.teachers.filter(t => t.status === 'present').length
                      }
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {attendanceType === 'students' 
                        ? studentsOnDate!.summary.totalAbsent 
                        : teachersOnDate!.teachers.filter(t => t.status === 'absent').length
                      }
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {attendanceType === 'students' 
                        ? (studentsOnDate!.summary.total > 0 
                            ? ((studentsOnDate!.summary.totalPresent / studentsOnDate!.summary.total) * 100).toFixed(1)
                            : 0)
                        : (teachersOnDate!.teachers.length > 0 
                            ? ((teachersOnDate!.teachers.filter(t => t.status === 'present').length / teachersOnDate!.teachers.length) * 100).toFixed(1)
                            : 0)
                      }%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Present Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    Present {attendanceType === 'students' ? 'Students' : 'Teachers'} ({
                      attendanceType === 'students' 
                        ? studentsOnDate!.present.length 
                        : teachersOnDate!.teachers.filter(t => t.status === 'present').length
                    })
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(attendanceType === 'students' 
                    ? studentsOnDate!.present.length 
                    : teachersOnDate!.teachers.filter(t => t.status === 'present').length
                  ) > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>{attendanceType === 'students' ? 'Roll Number' : 'Employee ID'}</TableHead>
                          <TableHead>{attendanceType === 'students' ? 'Grade' : 'Department'}</TableHead>
                          <TableHead>{attendanceType === 'students' ? 'Group' : 'Designation'}</TableHead>
                          <TableHead>Time Marked</TableHead>
                          {attendanceType === 'teachers' && (
                            <>
                              <TableHead>Time In</TableHead>
                              <TableHead>Time Out</TableHead>
                            </>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceType === 'students' 
                          ? studentsOnDate!.present.map((student) => (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.rollNumber}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>{student.group}</TableCell>
                                <TableCell className="text-green-600">{student.timeMarked}</TableCell>
                              </TableRow>
                            ))
                          : teachersOnDate!.teachers.filter(t => t.status === 'present').map((teacher) => (
                              <TableRow key={teacher.id}>
                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                <TableCell>{teacher.employeeId}</TableCell>
                                <TableCell>{teacher.department}</TableCell>
                                <TableCell>{teacher.designation}</TableCell>
                                <TableCell className="text-green-600">{teacher.timeMarked || 'N/A'}</TableCell>
                                <TableCell className="text-blue-600">{teacher.timeIn || 'N/A'}</TableCell>
                                <TableCell className="text-orange-600">{teacher.timeOut || 'N/A'}</TableCell>
                              </TableRow>
                            ))
                        }
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No {attendanceType === 'students' ? 'students' : 'teachers'} marked present on this date
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Absent Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserX className="h-4 w-4 text-red-500" />
                    Absent {attendanceType === 'students' ? 'Students' : 'Teachers'} ({
                      attendanceType === 'students' 
                        ? studentsOnDate!.absent.length 
                        : teachersOnDate!.teachers.filter(t => t.status === 'absent').length
                    })
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(attendanceType === 'students' 
                    ? studentsOnDate!.absent.length 
                    : teachersOnDate!.teachers.filter(t => t.status === 'absent').length
                  ) > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>{attendanceType === 'students' ? 'Roll Number' : 'Employee ID'}</TableHead>
                          <TableHead>{attendanceType === 'students' ? 'Grade' : 'Department'}</TableHead>
                          <TableHead>{attendanceType === 'students' ? 'Group' : 'Designation'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceType === 'students' 
                          ? studentsOnDate!.absent.map((student) => (
                              <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell>{student.rollNumber}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>{student.group}</TableCell>
                              </TableRow>
                            ))
                          : teachersOnDate!.teachers.filter(t => t.status === 'absent').map((teacher) => (
                              <TableRow key={teacher.id}>
                                <TableCell className="font-medium">{teacher.name}</TableCell>
                                <TableCell>{teacher.employeeId}</TableCell>
                                <TableCell>{teacher.department}</TableCell>
                                <TableCell>{teacher.designation}</TableCell>
                              </TableRow>
                            ))
                        }
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No {attendanceType === 'students' ? 'students' : 'teachers'} marked absent on this date
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AttendanceOverview;
