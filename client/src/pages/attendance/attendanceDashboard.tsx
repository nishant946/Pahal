import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  UserCheck,
  UserX,
  TrendingUp,
  Calendar,
  BarChart3,
  Download,
  Clock,
} from "lucide-react";
import { useAttendance } from "@/contexts/attendanceContext";
import teacherService from "@/services/teacherService";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  presentStudents: number;
  presentTeachers: number;
  absentStudents: number;
  absentTeachers: number;
  studentAttendancePercentage: number;
  teacherAttendancePercentage: number;
  todayDate: string;
}

function AttendanceDashboard() {
  const navigate = useNavigate();
  const { students, todayAttendance } = useAttendance();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    presentStudents: 0,
    presentTeachers: 0,
    absentStudents: 0,
    absentTeachers: 0,
    studentAttendancePercentage: 0,
    teacherAttendancePercentage: 0,
    todayDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [students, todayAttendance]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      console.log("Today's Attendance Data:", todayAttendance);

      // Fetch teachers
      const teachersData = await teacherService.getAllTeachers();

      // Get today's attendance for teachers
      const todayDate = new Date().toISOString().split("T")[0];
      let presentTeachers = 0;

      try {
        const teacherAttendance = await fetch(
          `/api/v1/teacher-attendance/date?date=${todayDate}`
        );
        if (teacherAttendance.ok) {
          const data = await teacherAttendance.json();
          presentTeachers = data.presentTeachers?.length || 0;
        }
      } catch (error) {
        console.error("Error fetching teacher attendance:", error);
      }

      // Use todayAttendance from context for present students
      const presentStudents = todayAttendance.presentStudents.length;
      const totalStudents = students.length;
      const totalTeachers = teachersData.length;
      const absentStudents = totalStudents - presentStudents;
      const absentTeachers = totalTeachers - presentTeachers;

      const studentAttendancePercentage =
        totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
      const teacherAttendancePercentage =
        totalTeachers > 0 ? (presentTeachers / totalTeachers) * 100 : 0;

      setStats({
        totalStudents,
        totalTeachers,
        presentStudents,
        presentTeachers,
        absentStudents,
        absentTeachers,
        studentAttendancePercentage,
        teacherAttendancePercentage,
        todayDate,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadDashboardReport = () => {
    const reportData = {
      date: stats.todayDate,
      summary: {
        totalStudents: stats.totalStudents,
        totalTeachers: stats.totalTeachers,
        presentStudents: stats.presentStudents,
        presentTeachers: stats.presentTeachers,
        absentStudents: stats.absentStudents,
        absentTeachers: stats.absentTeachers,
        studentAttendancePercentage: stats.studentAttendancePercentage,
        teacherAttendancePercentage: stats.teacherAttendancePercentage,
      },
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_dashboard_${stats.todayDate}.json`;
    a.click();
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading dashboard data...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-2 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Attendance Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Overview for {new Date(stats.todayDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              onClick={downloadDashboardReport}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/attendance")}
              className="w-full sm:w-auto"
            >
              Back to Attendance
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                {stats.totalStudents}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                {stats.totalTeachers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Present Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                {stats.presentStudents + stats.presentTeachers}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {stats.presentStudents} students, {stats.presentTeachers}{" "}
                teachers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-2">
                <UserX className="w-4 h-4" />
                Absent Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">
                {stats.absentStudents + stats.absentTeachers}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {stats.absentStudents} students, {stats.absentTeachers} teachers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Student Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                Student Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium">
                    Present
                  </span>
                  <span className="text-sm sm:text-lg font-semibold text-green-600">
                    {stats.presentStudents}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium">Absent</span>
                  <span className="text-sm sm:text-lg font-semibold text-red-600">
                    {stats.absentStudents}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium">
                    Attendance Rate
                  </span>
                  <span
                    className={`text-sm sm:text-lg font-semibold ${
                      stats.studentAttendancePercentage >= 75
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.studentAttendancePercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stats.studentAttendancePercentage >= 75
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        stats.studentAttendancePercentage,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-xs sm:text-sm"
                  onClick={() => navigate("/attendance/studentreport")}
                >
                  View Student Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                Teacher Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium">
                    Present
                  </span>
                  <span className="text-sm sm:text-lg font-semibold text-green-600">
                    {stats.presentTeachers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium">Absent</span>
                  <span className="text-sm sm:text-lg font-semibold text-red-600">
                    {stats.absentTeachers}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium">
                    Attendance Rate
                  </span>
                  <span
                    className={`text-sm sm:text-lg font-semibold ${
                      stats.teacherAttendancePercentage >= 75
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.teacherAttendancePercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stats.teacherAttendancePercentage >= 75
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        stats.teacherAttendancePercentage,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-xs sm:text-sm opacity-50 pointer-events-none cursor-not-allowed"
                  onClick={() => {}}
                  title="Coming soon"
                >
                  View Teacher Report
                  <span className="ml-2 text-xs text-gray-400">
                    (Coming soon)
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="h-16 sm:h-20 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm"
                onClick={() => navigate("/attendance/markattendance")}
              >
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6" />
                <span>Mark Student Attendance</span>
              </Button>

              <Button
                variant="outline"
                className="h-16 sm:h-20 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm opacity-50 pointer-events-none cursor-not-allowed"
                onClick={() => {}}
                title="Coming soon"
              >
                <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
                <span>Mark Teacher Attendance</span>
                <span className="text-xs text-gray-400">(Coming soon)</span>
              </Button>

              <Button
                variant="outline"
                className="h-16 sm:h-20 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm"
                onClick={() => navigate("/attendance/studentreport")}
              >
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6" />
                <span>Student Reports</span>
              </Button>

              <Button
                variant="outline"
                className="h-16 sm:h-20 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm opacity-50 pointer-events-none cursor-not-allowed"
                onClick={() => {}}
                title="Coming soon"
              >
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6" />
                <span>Teacher Reports</span>
                <span className="text-xs text-gray-400">(Coming soon)</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default AttendanceDashboard;
