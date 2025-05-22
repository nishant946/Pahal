import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TeacherAttendance {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  batch: string;
  attendance: {
    date: string;
    status: 'present' | 'absent';
    timeIn: string;
  }[];
}

const dummyTeacherData: TeacherAttendance[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    employeeId: 'T001',
    department: 'Mathematics',
    batch: '2025',
    attendance: [
      { date: '2025-05-20', status: 'present', timeIn: '08:30 AM' },
      { date: '2025-05-19', status: 'present', timeIn: '08:45 AM' },
      { date: '2025-05-18', status: 'absent', timeIn: '-' },
    ]
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    employeeId: 'T002',
    department: 'Science',
    batch: '2025',
    attendance: [
      { date: '2025-05-20', status: 'present', timeIn: '08:15 AM' },
      { date: '2025-05-19', status: 'present', timeIn: '08:30 AM' },
      { date: '2025-05-18', status: 'present', timeIn: '08:20 AM' },
    ]
  }
]

function TeacherAttendance() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [teachers] = useState<TeacherAttendance[]>(dummyTeacherData)

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const downloadCSV = () => {
    const headers = ['Name', 'Employee ID', 'Department', 'Batch', 'Date', 'Status', 'Time In']
    const csvData = filteredTeachers.flatMap(teacher =>
      teacher.attendance.map(att => [
        teacher.name,
        teacher.employeeId,
        teacher.department,
        teacher.batch,
        att.date,
        att.status,
        att.timeIn
      ].join(','))
    )
    
    const csv = [headers.join(','), ...csvData].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'teacher_attendance.csv'
    a.click()
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
          <Button onClick={downloadCSV}>Download CSV</Button>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTeachers.map(teacher => 
                teacher.attendance.map((att, idx) => (
                  <tr key={`${teacher.id}-${idx}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.employeeId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{teacher.batch}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{att.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        att.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{att.timeIn}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default TeacherAttendance