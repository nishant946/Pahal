import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Calendar, TrendingUp, Clock, ArrowLeft, User } from 'lucide-react'
import teacherService from '@/services/teacherService'
import type { Teacher, TeacherAttendance } from '@/services/teacherService'





interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
  timeMarked?: string;
  timeIn?: string;
  timeOut?: string;
  notes?: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  attendancePercentage: number;
}

type ViewMode = 'daily' | 'weekly' | 'monthly';

function IndividualTeacherReport() {
  const navigate = useNavigate()
  const { teacherId } = useParams<{ teacherId: string }>()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('daily')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0]
  })
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    attendancePercentage: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (teacherId) {
      fetchTeacherData()
      fetchAttendanceData()
    }
  }, [teacherId, dateRange, viewMode])

  const fetchTeacherData = async () => {
    if (!teacherId) return

    try {
      const teacherData = await teacherService.getTeacherById(teacherId)
      setTeacher(teacherData)
    } catch (error) {
      console.error('Error fetching teacher data:', error)
    }
  }

  const fetchAttendanceData = async () => {
    if (!teacherId) return

    try {
      setLoading(true)
      
      // Fetch attendance records
      const response = await teacherService.getTeacherAttendance(teacherId)
      const allRecords = response || []
      
      // Filter records by date range
      const filteredRecords = allRecords.filter((record: TeacherAttendance) => {
        const recordDate = new Date(record.date).toISOString().split('T')[0]
        return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate
      })

      // Sort by date (newest first)
      const sortedRecords = filteredRecords.sort((a: TeacherAttendance, b: TeacherAttendance) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      // Transform to our format
      const transformedRecords: AttendanceRecord[] = sortedRecords.map(record => ({
        date: record.date,
        status: record.status,
        timeMarked: record.timeMarked,
        timeIn: record.timeIn,
        timeOut: record.timeOut,
        notes: record.notes
      }))

      setAttendanceRecords(transformedRecords)

      // Calculate stats
      const total = transformedRecords.length
      const present = transformedRecords.filter(r => r.status === 'present').length
      const absent = total - present
      const percentage = total > 0 ? (present / total) * 100 : 0

      setStats({
        total,
        present,
        absent,
        attendancePercentage: percentage
      })
    } catch (error) {
      console.error('Error fetching attendance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRangeForMode = (mode: ViewMode) => {
    const end = new Date()
    const start = new Date()

    switch (mode) {
      case 'weekly':
        start.setDate(end.getDate() - 7)
        break
      case 'monthly':
        start.setMonth(end.getMonth() - 1)
        break
      case 'daily':
      default:
        start.setDate(end.getDate() - 30) // Default to 30 days
        break
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    }
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    const newRange = getDateRangeForMode(mode)
    setDateRange(newRange)
  }

  const downloadIndividualReport = () => {
    if (!teacher) return

    const headers = ['Date', 'Status', 'Time Marked', 'Time In', 'Time Out', 'Day of Week', 'Notes']
    const csvData = attendanceRecords.map(record => {
      const date = new Date(record.date)
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
      return [
        date.toLocaleDateString(),
        record.status,
        record.timeMarked || 'N/A',
        record.timeIn || 'N/A',
        record.timeOut || 'N/A',
        dayOfWeek,
        record.notes || 'N/A'
      ].join(',')
    })

    const csv = [headers.join(','), ...csvData].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${teacher.name}_attendance_${viewMode}_${dateRange.startDate}_to_${dateRange.endDate}.csv`
    a.click()
  }

  const downloadDetailedReport = () => {
    if (!teacher) return

    const reportData = {
      teacherInfo: {
        name: teacher.name,
        rollNo: teacher.rollNo,
        department: teacher.department,
        designation: teacher.designation,
        email: teacher.email,
        mobileNo: teacher.mobileNo,
        qualification: teacher.qualification,
        subjectChoices: teacher.subjectChoices
      },
      attendanceSummary: {
        period: `${dateRange.startDate} to ${dateRange.endDate}`,
        viewMode,
        totalDays: stats.total,
        presentDays: stats.present,
        absentDays: stats.absent,
        attendancePercentage: stats.attendancePercentage
      },
      attendanceRecords: attendanceRecords.map(record => ({
        date: new Date(record.date).toLocaleDateString(),
        dayOfWeek: new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
        status: record.status,
        timeMarked: record.timeMarked || 'N/A',
        timeIn: record.timeIn || 'N/A',
        timeOut: record.timeOut || 'N/A',
        notes: record.notes || 'N/A'
      }))
    }

    const jsonString = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${teacher.name}_detailed_attendance_${viewMode}_${dateRange.startDate}_to_${dateRange.endDate}.json`
    a.click()
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading attendance data...</div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!teacher) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Teacher not found.</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/attendance/teacherattendance')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Individual Teacher Report</h1>
              <p className="text-gray-600">{teacher.name} - {teacher.rollNo}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadIndividualReport}>
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
            <Button variant="outline" onClick={downloadDetailedReport}>
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
          </div>
        </div>

        {/* Teacher Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Teacher Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-lg">{teacher.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Employee ID</p>
                <p className="text-lg">{teacher.rollNo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Department</p>
                <p className="text-lg">{teacher.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Designation</p>
                <p className="text-lg">{teacher.designation}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg">{teacher.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="text-lg">{teacher.mobileNo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Qualification</p>
                <p className="text-lg">{teacher.qualification}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-lg">{teacher.subjectChoices.join(', ')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Mode Selector */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'outline'}
              onClick={() => handleViewModeChange('daily')}
            >
              Daily (30 Days)
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'outline'}
              onClick={() => handleViewModeChange('weekly')}
            >
              Weekly (7 Days)
            </Button>
            <Button
              variant={viewMode === 'monthly' ? 'default' : 'outline'}
              onClick={() => handleViewModeChange('monthly')}
            >
              Monthly (30 Days)
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Total Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Present Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Absent Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Attendance %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.attendancePercentage.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Marked</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendanceRecords.map((record, index) => {
                    const date = new Date(record.date)
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {date.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {dayOfWeek}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === 'present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {record.timeMarked || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {record.timeIn || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {record.timeOut || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {record.notes || 'N/A'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {attendanceRecords.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No attendance records found for the selected period.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default IndividualTeacherReport 