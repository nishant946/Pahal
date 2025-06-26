import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download } from 'lucide-react'
import { useAttendance } from '@/contexts/attendanceContext'

function StudentReport() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const { students, getStudentAttendanceStats } = useAttendance()

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (dateRange) {
      case 'weekly':
        start.setDate(end.getDate() - 7);
        break;
      case 'monthly':
        start.setMonth(end.getMonth() - 1);
        break;
      default: // daily
        start.setDate(end.getDate() - 1);
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  };

  const { startDate, endDate } = getDateRange();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAttendanceData = (student: typeof students[0]) => {
    return getStudentAttendanceStats(student.id, startDate, endDate);
  };

  const downloadReport = () => {
    const headers = ['Name', 'Roll Number', 'Grade', 'Group', 'Total Days', 'Present Days', 'Absent Days', 'Attendance %'];
    const csvData = filteredStudents.map(student => {
      const stats = getAttendanceData(student);
      return [
        student.name,
        student.rollNumber,
        student.grade,
        student.group,
        stats.totalDays,
        stats.presentDays,
        stats.absentDays,
        stats.attendancePercentage.toFixed(2)
      ].join(',');
    });

    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_attendance_${dateRange}_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/attendance')}>
              Back
            </Button>
            <h1 className="text-2xl font-bold">Student Attendance Report</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={dateRange === 'daily' ? 'default' : 'outline'}
              onClick={() => setDateRange('daily')}
            >
              Daily
            </Button>
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
            placeholder="Search by name, roll number, grade, or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={downloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map(student => {
                const stats = getAttendanceData(student);
                return (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.rollNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.group}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{stats.totalDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">{stats.presentDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600">{stats.absentDays}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        stats.attendancePercentage >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {stats.attendancePercentage.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No students found matching your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default StudentReport