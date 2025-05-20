import { useState } from 'react'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, Search, Download, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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

const dummyTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    employeeId: 'T001',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    email: 'priya.sharma@pahal.edu',
    phone: '+91 98765 43210',
    subjects: ['Mathematics', 'Statistics'],
    qualification: 'M.Sc. Mathematics',
    joiningDate: '2023-01-15',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    employeeId: 'T002',
    department: 'Science',
    designation: 'Physics Teacher',
    email: 'rajesh.kumar@pahal.edu',
    phone: '+91 98765 43211',
    subjects: ['Physics', 'Mathematics'],
    qualification: 'M.Sc. Physics',
    joiningDate: '2023-02-01',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
  },
  {
    id: '3',
    name: 'Anita Desai',
    employeeId: 'T003',
    department: 'English',
    designation: 'Language Teacher',
    email: 'anita.desai@pahal.edu',
    phone: '+91 98765 43212',
    subjects: ['English Literature', 'Grammar'],
    qualification: 'M.A. English',
    joiningDate: '2023-03-15',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita'
  }
]

function AddTeacherDialog({ onAdd }: { onAdd: (teacher: Omit<Teacher, 'id' | 'image'>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    department: '',
    designation: '',
    email: '',
    phone: '',
    subjects: '',
    qualification: '',
    joiningDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      subjects: formData.subjects.split(',').map(s => s.trim())
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={e => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={e => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects (comma-separated)</Label>
              <Input
                id="subjects"
                value={formData.subjects}
                onChange={e => setFormData(prev => ({ ...prev, subjects: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={e => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Teacher</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Teachers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [teachers, setTeachers] = useState<Teacher[]>(dummyTeachers)

  const addTeacher = (newTeacher: Omit<Teacher, 'id' | 'image'>) => {
    const teacher: Teacher = {
      ...newTeacher,
      id: (teachers.length + 1).toString(),
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTeacher.name}`
    }
    setTeachers(prev => [...prev, teacher])
  }

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
          <div className="flex gap-2">
            <AddTeacherDialog onAdd={addTeacher} />
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