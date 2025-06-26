import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  batch: string;
  isPresent: boolean;
  timeIn?: string;
}

const dummyTeachers: Teacher[] = [  {
    id: '1',
    name: 'Nishant Somesh',
    employeeId: 'T001',
    department: 'Mathematics',
    batch: '2025',
    isPresent: false
  },
  {
    id: '2',
    name: 'Aman',
    employeeId: 'T002',
    department: 'Science',
    batch: '2025',
    isPresent: false
  },
  {
    id: '3',
    name: 'Pratyaksh',
    employeeId: 'T003',
    department: 'English',
    batch: '2025',
    isPresent: false
  }
]

function MarkTeacherAttendance() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [teachers, setTeachers] = useState<Teacher[]>(dummyTeachers)
  const [currentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleAttendance = (teacherId: string) => {
    setTeachers(teachers.map(teacher =>
      teacher.id === teacherId
        ? {
            ...teacher,
            isPresent: !teacher.isPresent,
            timeIn: !teacher.isPresent ? currentTime : undefined
          }
        : teacher
    ))
  }

  const saveAttendance = () => {
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', teachers)
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/attendance')}>
              Back
            </Button>
            <h1 className="text-2xl font-bold">Mark Teacher Attendance</h1>
          </div>
          <div className="text-gray-600">
            Current Time: {currentTime}
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present</th>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      checked={teacher.isPresent}
                      onCheckedChange={() => toggleAttendance(teacher.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {teacher.timeIn || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Button onClick={saveAttendance}>Save Attendance</Button>
        </div>
      </div>
    </Layout>
  )
}

export default MarkTeacherAttendance
