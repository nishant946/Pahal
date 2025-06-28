import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Eye } from 'lucide-react'
import teacherService from '@/services/teacherService'
import type { Teacher, TeacherAttendanceStats } from '@/services/teacherService'

interface TeacherWithStats extends Teacher {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;
}

function TeacherAttendance() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<'weekly' | 'monthly'>('weekly')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [teacherStats, setTeacherStats] = useState<{ [id: string]: TeacherAttendanceStats }>({})
  const [loadingStats, setLoadingStats] = useState(false)
  const [loadingTeachers, setLoadingTeachers] = useState(true)

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();

    if (dateRange === 'weekly') {
      start.setDate(end.getDate() - 7);
    } else if (dateRange === 'monthly') {
      start.setMonth(end.getMonth() - 1);
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  const { startDate, endDate } = getDateRange();

  const filteredTeachers = useMemo(() =>
    teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [teachers, searchQuery]
  );

  // Fetch all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        const teachersData = await teacherService.getAllTeachers();
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  // Fetch attendance stats for all teachers
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const statsArr = await Promise.all(
          filteredTeachers.map(teacher =>
            teacherService.getTeacherAttendanceStats(teacher.id, startDate, endDate)
          )
        );
        
        if (isMounted) {
          const statsObj: { [id: string]: TeacherAttendanceStats } = {};
          filteredTeachers.forEach((teacher, i) => {
            statsObj[teacher.id] = statsArr[i] || { total: 0, present: 0, absent: 0, attendancePercentage: 0 };
          });
          setTeacherStats(statsObj);
        }
      } catch (error) {
        console.error('Error fetching teacher stats:', error);
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    if (filteredTeachers.length > 0) {
      fetchStats();
    }
    
    return () => { isMounted = false; };
  }, [teachers, searchQuery, startDate, endDate]);

  const downloadReport = async () => {
    const headers = ['Name', 'Employee ID', 'Department', 'Designation', 'Total Days', 'Present Days', 'Absent Days', 'Attendance %'];
    
    // Fetch all stats in parallel
    const statsArray = await Promise.all(filteredTeachers.map(teacher =>
      teacherService.getTeacherAttendanceStats(teacher.id, startDate, endDate)
    ));
    
    const csvData = filteredTeachers.map((teacher, i) => {
      const stats = statsArray[i] || { total: 0, present: 0, absent: 0, attendancePercentage: 0 };
      return [
        teacher.name,
        teacher.employeeId,
        teacher.department,
        teacher.designation,
        stats.total,
        stats.present,
        stats.absent,
        stats.attendancePercentage.toFixed(2)
      ].join(',');
    });

    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teacher_attendance_${dateRange}_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  const viewIndividualReport = (teacherId: string) => {
    navigate(`/attendance/teacher/${teacherId}/report`);
  };

  if (loadingTeachers) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading teachers...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/attendance')}>
              Back
            </Button>
            <h1 className="text-2xl font-bold">Teacher Attendance Report</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={dateRange === 'weekly' ? 'default' : 'outline'}
              onClick={() => setDateRange('weekly')}
            >
              Weekly
            </Button>
            <Button
              variant={dateRange === 'monthly' ? 'default' : 'outline'}
              onClick={() => setDateRange('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Search by name, employee ID, department, or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={downloadReport} disabled={loadingStats}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.map(teacher => {
                const stats = teacherStats[teacher.id] || { total: 0, present: 0, absent: 0, attendancePercentage: 0 };
                return (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{stats.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">{stats.present}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600">{stats.absent}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        stats.attendancePercentage >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {stats.attendancePercentage.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewIndividualReport(teacher.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTeachers.length === 0 && !loadingTeachers && (
          <div className="text-center py-8">
            <p className="text-gray-500">No teachers found matching your search.</p>
          </div>
        )}

        {loadingStats && (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading attendance statistics...</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TeacherAttendance