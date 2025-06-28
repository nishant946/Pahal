import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download } from 'lucide-react'

interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  batch: string;
  timeIn: string;
}

const dummyPresentTeachers: Teacher[] = [  {
    id: '1',
    name: 'Nishant Somesh',
    employeeId: 'T001',
    department: 'Mathematics',
    batch: '2025',
    timeIn: '08:30 AM'
  },
  {
    id: '2',
    name: 'Aman',
    employeeId: 'T002',
    department: 'Science',
    batch: '2025',
    timeIn: '08:15 AM'
  },
  {
    id: '3',
    name: 'Pratyaksh',
    employeeId: 'T003',
    department: 'English',
    batch: '2025',
    timeIn: '08:45 AM'
  }
]

function TodayTeacherAttendance() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [presentTeachers] = useState<Teacher[]>(dummyPresentTeachers)
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }))

  const filteredTeachers = presentTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const downloadCSV = () => {
    const headers = ['Name', 'Employee ID', 'Department', 'Batch', 'Time In']
    const csvData = filteredTeachers.map(teacher => [
      teacher.name,
      teacher.employeeId,
      teacher.department,
      teacher.batch,
      teacher.timeIn
    ].join(','))
    
    const csv = [headers.join(','), ...csvData].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `teacher_attendance_${timestamp}.csv`
    a.click()
  }

  return (
    <Layout>
      <div className="p-6 relative">
        <div className="absolute inset-0 bg-gray-100 bg-opacity-80 z-10 flex flex-col items-center justify-center" style={{ pointerEvents: 'auto' }}>
          <div className="text-2xl font-bold text-gray-500 mb-2">Coming soon</div>
          <div className="text-sm text-gray-400">This feature will be available in a future update.</div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/attendance')}>
                Back
              </Button>
              <h1 className="text-2xl font-bold">Today's Teacher Attendance</h1>
            </div>
            <div className="text-gray-600">
              {currentDate}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="text-lg font-semibold mb-2">Summary</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Present Teachers</div>
                <div className="text-2xl font-bold text-green-600">{presentTeachers.length}</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Absent Teachers</div>
                <div className="text-2xl font-bold text-red-600">2</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Teachers</div>
                <div className="text-2xl font-bold text-blue-600">{presentTeachers.length + 2}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              placeholder="Search by name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={downloadCSV}>
              <Download className="w-4 h-4 mr-2" />
              Download Today's Report
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTeachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.batch}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600">{teacher.timeIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TodayTeacherAttendance