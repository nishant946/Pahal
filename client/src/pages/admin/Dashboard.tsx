import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  School, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  UserCheck,
  UserX,
  RefreshCw,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Eye
} from "lucide-react";
import { useTeacherAuth } from '@/contexts/teacherAuthContext';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { SkeletonCard } from "@/components/ui/skeleton";

interface DashboardStats {
  totalTeachers: number;
  verifiedTeachers: number;
  unverifiedTeachers: number;
  totalStudents: number;
  totalCourses: number;
  recentActivities: Array<{
    action: string;
    name: string;
    time: string;
  }>;
}

interface AttendanceStats {
  todayAttendance: number;
  totalStudents: number;
  todayAttendancePercentage: number;
  absentToday: number;
  monthlyAttendancePercentage: number;
}

interface QuickActions {
  pendingVerifications: number;
  lowAttendanceAlerts: number;
  recentRegistrations: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    verifiedTeachers: 0,
    unverifiedTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
    recentActivities: []
  });
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    todayAttendance: 0,
    totalStudents: 0,
    todayAttendancePercentage: 0,
    absentToday: 0,
    monthlyAttendancePercentage: 0
  });
  const [quickActions, setQuickActions] = useState<QuickActions>({
    pendingVerifications: 0,
    lowAttendanceAlerts: 0,
    recentRegistrations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { teacher } = useTeacherAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, attendanceResponse] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/attendance/overview')
      ]);
      
      setStats(dashboardResponse.data);
      setAttendanceStats(attendanceResponse.data);
      
      // Calculate quick actions
      setQuickActions({
        pendingVerifications: dashboardResponse.data.unverifiedTeachers,
        lowAttendanceAlerts: attendanceResponse.data.todayAttendancePercentage < 75 ? 1 : 0,
        recentRegistrations: dashboardResponse.data.recentActivities.filter(
          (activity: any) => activity.action === "Teacher Registration"
        ).length
      });
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (percentage >= 75) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percentage >= 60) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { status: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        
        {/* Statistics Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <SkeletonCard key={index} showButton={false} lines={2} />
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <SkeletonCard className="p-6" lines={4} showButton={false} />

        {/* Main Content Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <SkeletonCard className="p-6" lines={6} showButton={false} />
          <SkeletonCard className="p-6" lines={6} showButton={false} />
        </div>

        {/* Bottom Content Skeleton */}
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} className="p-6" lines={5} showButton={false} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <div className="text-red-800">{error}</div>
          </div>
        </div>
        <Button onClick={fetchAllData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const attendanceStatus = getAttendanceStatus(attendanceStats.todayAttendancePercentage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {getCurrentGreeting()}, {teacher?.name}! Here's your institution overview.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={fetchAllData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button onClick={() => navigate('/admin/attendance')} variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-1" />
            View Details
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Teachers */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalTeachers}</div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600 font-medium">{stats.verifiedTeachers} verified</span>
              {stats.unverifiedTeachers > 0 && (
                <span className="text-yellow-600 font-medium ml-1">
                  • {stats.unverifiedTeachers} pending
                </span>
              )}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${stats.totalTeachers > 0 ? (stats.verifiedTeachers / stats.totalTeachers) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Attendance */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceStats.todayAttendance}</div>
            <p className="text-xs text-gray-600 mt-1">
              <span className={attendanceStatus.color + " font-medium"}>
                {attendanceStats.todayAttendancePercentage.toFixed(1)}% attendance
              </span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  attendanceStats.todayAttendancePercentage >= 75 ? 'bg-green-500' : 
                  attendanceStats.todayAttendancePercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(attendanceStats.todayAttendancePercentage, 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Total Students */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <School className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-red-600 font-medium">{attendanceStats.absentToday} absent today</span>
            </p>
            <div className="flex items-center mt-2">
              <UserCheck className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-gray-600">Active enrollment</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            {attendanceStats.monthlyAttendancePercentage >= 80 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              attendanceStats.monthlyAttendancePercentage >= 80 ? 'text-green-600' : 
              attendanceStats.monthlyAttendancePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {attendanceStats.monthlyAttendancePercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className={`font-medium ${
                attendanceStats.monthlyAttendancePercentage >= 80 ? 'text-green-600' : 
                attendanceStats.monthlyAttendancePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {attendanceStats.monthlyAttendancePercentage >= 80 ? 'Excellent trend' : 
                 attendanceStats.monthlyAttendancePercentage >= 60 ? 'Good trend' : 'Needs improvement'}
              </span>
            </p>
            <div className="flex items-center mt-2">
              <Calendar className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-xs text-gray-600">This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/admin/teachers')} 
              variant="outline" 
              className="w-full justify-start"
              disabled={quickActions.pendingVerifications === 0}
            >
              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
              Verify Teachers ({quickActions.pendingVerifications})
            </Button>
            
            <Button 
              onClick={() => navigate('/admin/attendance')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
              View Attendance Details
            </Button>
            
            <Button 
              onClick={() => navigate('/admin/contributors')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Users className="h-4 w-4 mr-2 text-green-500" />
              Manage Contributors
            </Button>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.pendingVerifications > 0 && (
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    {quickActions.pendingVerifications} teacher{quickActions.pendingVerifications > 1 ? 's' : ''} 
                    {' '}awaiting verification
                  </p>
                </div>
              </div>
            )}
            
            {quickActions.lowAttendanceAlerts > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <UserX className="h-4 w-4 text-red-600 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">
                    Low attendance alert - {attendanceStats.todayAttendancePercentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
            
            {quickActions.pendingVerifications === 0 && quickActions.lowAttendanceAlerts === 0 && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    All systems running smoothly
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Attendance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${attendanceStatus.bg} border`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Today's Status</span>
                <span className={`text-sm font-bold ${attendanceStatus.color}`}>
                  {attendanceStatus.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Present:</span>
                  <span className="font-medium text-green-600">{attendanceStats.todayAttendance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Absent:</span>
                  <span className="font-medium text-red-600">{attendanceStats.absentToday}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rate:</span>
                  <span className={`font-medium ${attendanceStatus.color}`}>
                    {attendanceStats.todayAttendancePercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/admin/attendance')} 
              variant="outline" 
              size="sm" 
              className="w-full mt-3"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </span>
            <Button variant="ghost" size="sm" onClick={fetchAllData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      activity.action.includes('Verified') ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {activity.action.includes('Verified') ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Users className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.name}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Footer */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
              <p className="text-sm text-gray-600">Active Courses</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-600">
                {Math.round((stats.verifiedTeachers / Math.max(stats.totalTeachers, 1)) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Teachers Verified</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold text-purple-600">
                {attendanceStats.monthlyAttendancePercentage.toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">Monthly Average</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
