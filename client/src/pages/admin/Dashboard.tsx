import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, School, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { useTeacherAuth } from '@/contexts/teacherAuthContext';
import api from '@/services/api';

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

// This is the admin dashboard page. It displays various statistics and recent activities related to the admin panel.
// It uses the Card component to display information in a structured format.
// The dashboard includes:
// - Total number of teachers
// - Pending verifications
// - Total number of courses
// - Active students
// - Recent activities such as teacher verification requests, new courses added, and profile updates.

// The dashboard is styled using Tailwind CSS classes for a clean and modern look.
// The icons are imported from the lucide-react library for better visual representation of each statistic.
// The AdminLayout component is used to wrap the dashboard content, providing a consistent layout across the admin pages.

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    verifiedTeachers: 0,
    unverifiedTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { teacher } = useTeacherAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, {teacher?.name}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedTeachers} verified, {stats.unverifiedTeachers} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unverifiedTeachers}</div>
            <p className="text-xs text-muted-foreground">
              Teacher verifications pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.name}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activities
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
