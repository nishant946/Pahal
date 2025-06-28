import React, { useEffect, useState } from 'react'
import Layout from '@/components/layout/layout'
import { HomeworkSummary } from '@/components/homework/HomeworkSummary'
import { YesterdayHomeworkSummary } from '@/components/homework/YesterdayHomeworkSummary'
import { User, Calendar, BookOpen, GraduationCap, UserCheck } from 'lucide-react'
import dashboardService from '@/services/dashboardService'
import teacherService from '@/services/teacherService'
import type { DashboardStats } from '@/services/dashboardService'
import type { Teacher } from '@/services/teacherService'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'

interface PresentPerson {
  id: string;
  name: string;
}

function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [presentStudents, setPresentStudents] = useState<PresentPerson[]>([]);
    const [presentTeachers, setPresentTeachers] = useState<PresentPerson[]>([]);
    const [preferredTodayTeachers, setPreferredTodayTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                const [dashboardData, teachersData] = await Promise.all([
                    dashboardService.getDashboardStats(),
                    teacherService.getAllTeachers()
                ]);
                setStats(dashboardData);
                setTeachers(teachersData);

                // Fetch present students
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];
                const studentRes = await fetch(`/api/v1/attendance/date?date=${todayStr}`);
                if (studentRes.ok) {
                  const data = await studentRes.json();
                  setPresentStudents(data.presentStudents || []);
                }
                // Fetch present teachers
                const teacherRes = await fetch(`/api/v1/teacher-attendance/date?date=${todayStr}`);
                if (teacherRes.ok) {
                  const data = await teacherRes.json();
                  setPresentTeachers(data.presentTeachers || []);
                }
                // Teachers with today as preferred day
                const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
                setPreferredTodayTeachers(teachersData.filter(t => t.preferredDays.includes(dayName)));
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        }
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-sm sm:text-base text-gray-600">Welcome to your school management dashboard</p>
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
                                        <p className="text-xs sm:text-sm font-medium text-gray-600">Total Students</p>
                                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats?.students.total || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="p-2 sm:p-3 rounded-full bg-green-100">
                                        <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-xs sm:text-sm font-medium text-gray-600">Present Today</p>
                                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats?.students.presentToday || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="p-2 sm:p-3 rounded-full bg-purple-100">
                                        <GraduationCap className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-xs sm:text-sm font-medium text-gray-600">Total Teachers</p>
                                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats?.teachers.total || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                                <div className="flex items-center">
                                    <div className="p-2 sm:p-3 rounded-full bg-orange-100">
                                        <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-xs sm:text-sm font-medium text-gray-600">Homework</p>
                                        <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats?.homework.total || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Present People Today */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                                <h2 className="text-sm sm:text-lg font-semibold mb-2">Present Students Today</h2>
                                {presentStudents.length > 0 ? (
                                    <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                                        {presentStudents.map(s => (
                                            <li key={s.id} className="text-xs sm:text-sm">{s.name}</li>
                                        ))}
                                    </ul>
                                ) : <div className="text-xs sm:text-sm text-gray-500">No students present today.</div>}
                            </div>
                            <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                                <h2 className="text-sm sm:text-lg font-semibold mb-2">Present Teachers Today</h2>
                                {presentTeachers.length > 0 ? (
                                    <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                                        {presentTeachers.map(t => (
                                            <li key={t.id} className="text-xs sm:text-sm">{t.name}</li>
                                        ))}
                                    </ul>
                                ) : <div className="text-xs sm:text-sm text-gray-500">No teachers present today.</div>}
                            </div>
                        </div>

                        {/* Teachers with today as preferred day */}
                        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                            <h2 className="text-sm sm:text-lg font-semibold mb-2">Teachers Preferring Today ({new Date().toLocaleDateString('en-US', { weekday: 'long' })})</h2>
                            {preferredTodayTeachers.length > 0 ? (
                                <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                                    {preferredTodayTeachers.map(t => (
                                        <li key={t.id} className="text-xs sm:text-sm">
                                            {t.name} <span className="text-xs text-gray-500">({t.department})</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <div className="text-xs sm:text-sm text-gray-500">No teachers have today as a preferred day.</div>}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                            <h2 className="text-sm sm:text-lg font-semibold mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <Button 
                                    onClick={() => navigate('/attendance/markattendance')}
                                    className="h-12 sm:h-16 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm"
                                >
                                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Mark Attendance
                                </Button>
                                <Button 
                                    onClick={() => navigate('/attendance/dashboard')}
                                    className="h-12 sm:h-16 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm"
                                >
                                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                                    View Reports
                                </Button>
                                <Button 
                                    onClick={() => navigate('/homework')}
                                    className="h-12 sm:h-16 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm"
                                >
                                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Manage Homework
                                </Button>
                                <Button 
                                    onClick={() => navigate('/teachers')}
                                    className="h-12 sm:h-16 flex flex-col items-center justify-center gap-2 text-xs sm:text-sm"
                                >
                                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                    Manage Teachers
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default Dashboard
