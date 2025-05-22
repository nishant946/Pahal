import { useState } from 'react'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, Search, Download } from 'lucide-react'

interface Teacher {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  subjects: string[];
  qualification: string;
  joiningDate: string;
  image: string;
}

const dummyTeachers: Teacher[] = [  {
    id: '1',
    name: 'Nishant',
    employeeId: 'T001',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    email: 'nishant@pahal.edu',
    phone: '+91 98765 43210',
    subjects: ['Mathematics', 'Statistics'],
    qualification: 'M.Sc. Mathematics',
    joiningDate: '2023-01-15',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nishant'
  },
  {
    id: '2',
    name: 'somesh',
    employeeId: 'T002',
    department: 'Science',
    designation: 'Physics Teacher',
    email: 'somesh@pahal.edu',
    phone: '+91 98765 43211',
    subjects: ['Physics', 'Mathematics'],
    qualification: 'M.Sc. Physics',
    joiningDate: '2023-02-01',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman'
  },
  {
    id: '3',
    name: 'Pratyaksh',
    employeeId: 'T003',
    department: 'English',
    designation: 'Language Teacher',
    email: 'pratyaksh@pahal.edu',
    phone: '+91 98765 43212',
    subjects: ['English Literature', 'Grammar'],
    qualification: 'M.A. English',
    joiningDate: '2023-03-15',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pratyaksh'
  }
];

function Teachers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [teachers] = useState<Teacher[]>(dummyTeachers)

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const downloadTeachersList = () => {
    const headers = ['Name', 'Employee ID', 'Department', 'Designation', 'Email', 'Phone', 'Subjects', 'Qualification', 'Joining Date']
    const csvData = filteredTeachers.map(teacher => [
      teacher.name,
      teacher.employeeId,
      teacher.department,
      teacher.designation,
      teacher.email,
      teacher.phone,
      teacher.subjects.join(', '),
      teacher.qualification,
      teacher.joiningDate
    ].join(','))
    
    const csv = [headers.join(','), ...csvData].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    const timestamp = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `teachers_list_${timestamp}.csv`
    a.click()
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teacher Profiles</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={downloadTeachersList}>
              <Download className="w-4 h-4 mr-2" />
              Download List
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, department, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 max-w-md"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            New teachers will be added automatically when they register through the registration page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map(teacher => (
            <div key={teacher.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="h-16 w-16 rounded-full bg-gray-100"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{teacher.name}</h3>
                    <p className="text-sm text-gray-600">{teacher.designation}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-24">Employee ID:</span>
                    <span>{teacher.employeeId}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-24">Department:</span>
                    <span>{teacher.department}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-24">Subjects:</span>
                    <span>{teacher.subjects.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-24">Qualification:</span>
                    <span>{teacher.qualification}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between">
                  <Button variant="ghost" className="text-sm" onClick={() => window.location.href = `mailto:${teacher.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="ghost" className="text-sm" onClick={() => window.location.href = `tel:${teacher.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No teachers found matching your search.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Teachers