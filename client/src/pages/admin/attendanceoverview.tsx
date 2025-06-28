import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Users, TrendingUp, TrendingDown } from "lucide-react";
import api from '@/services/api';

interface AttendanceOverview {
  todayAttendance: number;
  totalStudents: number;
  attendancePercentage: number;
}

const AttendanceOverview: React.FC = () => {
  const [overview, setOverview] = useState<AttendanceOverview>({
    todayAttendance: 0,
    totalStudents: 0,
    attendancePercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceOverview();
  }, []);

  const fetchAttendanceOverview = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/attendance/overview');
      setOverview(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendance overview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Attendance Overview</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Attendance Overview</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Attendance Overview</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.todayAttendance}</div>
            <p className="text-xs text-muted-foreground">
              Students present today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            {overview.attendancePercentage >= 80 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {overview.attendancePercentage >= 80 ? 'Good attendance' : 'Needs attention'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed View */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Present Today</p>
                <p className="text-sm text-muted-foreground">
                  {overview.todayAttendance} out of {overview.totalStudents} students
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  {overview.todayAttendance}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Absent Today</p>
                <p className="text-sm text-muted-foreground">
                  {overview.totalStudents - overview.todayAttendance} students
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">
                  {overview.totalStudents - overview.todayAttendance}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Attendance Percentage</p>
                <p className="text-sm text-muted-foreground">
                  Overall attendance rate
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${
                  overview.attendancePercentage >= 80 ? 'text-green-600' : 
                  overview.attendancePercentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {overview.attendancePercentage}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          This overview shows today's attendance statistics. For detailed reports, 
          visit the individual attendance pages.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AttendanceOverview;
