import { useEffect, useState } from "react";
import Layout from "@/components/layout/layout";

import {
  User,
  Calendar,
  BookOpen,
  GraduationCap,
  UserCheck,
  Phone,
} from "lucide-react";
import dashboardService from "@/services/dashboardService";
import teacherService from "@/services/teacherService";
import type { DashboardStats } from "@/services/dashboardService";
import type { Teacher } from "@/services/teacherService";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";

import { useAttendance } from "@/contexts/attendanceContext";



function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  // const [presentStudents, setPresentStudents] = useState<PresentPerson[]>([]);
  // const [presentTeachers, setPresentTeachers] = useState<PresentPerson[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [preferredTodayTeachers, setPreferredTodayTeachers] = useState<
    Teacher[]
  >([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { todayAttendance, students } = useAttendance();

  const handleCallTeacher = (teacher: Teacher) => {
    if (teacher.mobileNo) {
      // Create a tel: link to initiate the call
      const phoneNumber = teacher.mobileNo.replace(/\s+/g, ''); // Remove spaces
      window.open(`tel:${phoneNumber}`, '_self');
    } else {
      alert('No phone number available for this teacher');
    }
  };

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        const [dashboardData, teachersData] = await Promise.all([
          dashboardService.getDashboardStats(),
          teacherService.getAllTeachers(),
        ]);
        setStats(dashboardData);
        setTeachers(teachersData);

        console.log("Dashboard Data:", dashboardData);
        console.log("Teachers Data:", teachersData);

        // Fetch present students
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const studentRes = await fetch(
          `/api/v1/attendance/date?date=${todayStr}`
        );
        if (studentRes.ok) {
          // const data = await studentRes.json();
          // setPresentStudents(data.presentStudents || []);
        }
        // Fetch present teachers
        const teacherRes = await fetch(
          `/api/v1/teacher-attendance/date?date=${todayStr}`
        );
        if (teacherRes.ok) {
          // const data = await teacherRes.json();
          // setPresentTeachers(data.presentTeachers || []);
        }
        // Teachers with today as preferred day
        const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
        console.log("Today's day:", dayName);
        console.log("All teachers and their preferred days:");
        teachersData.forEach(teacher => {
          console.log(`${teacher.name}: ${teacher.preferredDays.join(', ')}`);
        });
        
        const teachersWithTodayPreferred = teachersData.filter((t) => t.preferredDays.includes(dayName));
        console.log("Teachers preferring today:", teachersWithTodayPreferred.map(t => t.name));
        
        setPreferredTodayTeachers(teachersWithTodayPreferred);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-2 sm:p-4 lg:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Welcome to your school management dashboard
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading dashboard...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 rounded-full bg-blue-100">
                    <User className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Total Students
                    </p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                      {students?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 rounded-full bg-green-100">
                    <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Present Today
                    </p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                      {todayAttendance.presentStudents.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                    <GraduationCap className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Total Teachers
                    </p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                      {teachers.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <div className="p-2 sm:p-3 rounded-full bg-orange-100">
                    <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">
                      Homework
                    </p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">
                      {stats?.homework.total || 0}
                    </p>
                  </div>
                </div>
              </div>

        
            </div>

            {/* Teachers with today as preferred day */}
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h2 className="text-sm sm:text-lg font-semibold mb-2">
                Teachers and Their Preferred Days
              </h2>
              
              {/* Special section for teachers preferring today */}
              {preferredTodayTeachers.length > 0 && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-2">
                    Teachers Preferring Today ({new Date().toLocaleDateString("en-US", { weekday: "long" })})
                  </h3>
                  <div className="space-y-2">
                    {preferredTodayTeachers.map((t) => (
                      <div key={t.id} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div>
                          <span className="text-sm font-medium">{t.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({t.department})</span>
                        </div>
                        {t.mobileNo && (
                          <button
                            onClick={() => handleCallTeacher(t)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-xs"
                            title={`Call ${t.name}`}
                          >
                            <Phone className="h-3 w-3" />
                            Call
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {teachers.length > 0 ? (
                <div className="space-y-2">
                  {teachers.map((t) => {
                    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
                    const prefersToday = t.preferredDays.includes(today);
                    return (
                      <div key={t.id} className={`p-2 rounded ${prefersToday ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-medium">
                                {t.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({t.department})
                              </span>
                              {prefersToday && (
                                <span className="text-xs text-green-600 font-medium">
                                  ← Today
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {t.preferredDays.join(', ')}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {t.mobileNo && (
                              <button
                                onClick={() => handleCallTeacher(t)}
                                className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                                title={`Call ${t.name}`}
                              >
                                <Phone className="h-3 w-3 text-blue-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-gray-500">
                  No teachers found.
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
              <h2 className="text-sm sm:text-lg font-semibold mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Button
                  onClick={() => navigate("/attendance/markattendance")}
                  className="h-12 sm:h-16 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  Mark Attendance
                </Button>
                <Button
                  onClick={() => {}}
                  className="h-12 sm:h-16 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm opacity-50 pointer-events-none cursor-not-allowed"
                  title="Coming soon"
                >
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  View Teacher Report
                 
                </Button>
                <Button
                  onClick={() => navigate("/homework")}
                  className="h-12 sm:h-16 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  Manage Homework
                </Button>
                <Button
                  onClick={() => {}}
                  className="h-12 sm:h-16 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm opacity-50 pointer-events-none cursor-not-allowed"
                  title="Coming soon"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Mark Teacher Attendance
              
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
