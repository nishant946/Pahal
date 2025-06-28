import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Calendar, TrendingUp, Clock, ArrowLeft } from 'lucide-react'
import { useAttendance } from '@/contexts/attendanceContext'
import api from '@/services/api'

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  grade: string;
  group: string;
  contact: string;
  parentName: string;
  address: string;
  joinDate: string;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
  timeMarked?: string;
}

interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  attendancePercentage: number;
}

type ViewMode = 'daily' | 'weekly' | 'monthly';

function IndividualStudentReport() {
  const navigate = useNavigate()
  const { studentId } = useParams<{ studentId: string }>()
  const { students } = useAttendance()
  const [student, setStudent] = useState<Student | null>(null)
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
    if (studentId) {
      const foundStudent = students.find(s => s.id === studentId)
      if (foundStudent) {
        setStudent(foundStudent)
        fetchAttendanceData()
      }
    }
  }, [studentId, students, dateRange, viewMode])

  const fetchAttendanceData = async () => {
    if (!studentId) return

    try {
      setLoading(true)
      
      // Fetch attendance records
      const response = await api.get(`/attendance/${studentId}`)
      if (response.status === 200) {
        const allRecords = response.data || []
        
        // Filter records by date range
        const filteredRecords = allRecords.filter((record: any) => {
          const recordDate = new Date(record.date).toISOString().split('T')[0]
          return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate
        })

        // Sort by date (newest first)
        const sortedRecords = filteredRecords.sort((a: any, b: any) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        setAttendanceRecords(sortedRecords)

        // Calculate stats
        const total = sortedRecords.length
        const present = sortedRecords.filter((r: any) => r.status === 'present').length
        const absent = total - present
        const percentage = total > 0 ? (present / total) * 100 : 0

        setStats({
          total,
          present,
          absent,
          attendancePercentage: percentage
        })
      }
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
    if (!student) return

    const headers = ['Date', 'Status', 'Time Marked', 'Day of Week']
    const csvData = attendanceRecords.map(record => {
      const date = new Date(record.date)
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })
      return [
        date.toLocaleDateString(),
        record.status,
        record.timeMarked || 'N/A',
        dayOfWeek
      ].join(',')
    })

    const csv = [headers.join(','), ...csvData].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${student.name}_attendance_${viewMode}_${dateRange.startDate}_to_${dateRange.endDate}.csv`
    a.click()
  }

  const downloadDetailedReport = () => {
    if (!student) return

    const reportData = {
      studentInfo: {
        name: student.name,
        rollNumber: student.rollNumber,
        grade: student.grade,
        group: student.group,
        contact: student.contact,
        parentName: student.parentName
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
        timeMarked: record.timeMarked || 'N/A'
      }))
    }

    const jsonString = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${student.name}_detailed_attendance_${viewMode}_${dateRange.startDate}_to_${dateRange.endDate}.json`
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

  if (!student) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Student not found.</p>
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
            <Button variant="outline" onClick={() => navigate('/attendance/studentreport')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Individual Student Report</h1>
              <p className="text-gray-600">{student.name} - {student.rollNumber}</p>
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

        {/* Student Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-lg">{student.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Roll Number</p>
                <p className="text-lg">{student.rollNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Grade</p>
                <p className="text-lg">{student.grade}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Group</p>
                <p className="text-lg">{student.group}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Contact</p>
                <p className="text-lg">{student.contact}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Parent Name</p>
                <p className="text-lg">{student.parentName}</p>
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

export default IndividualStudentReport 