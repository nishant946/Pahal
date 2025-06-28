import { useState, useEffect } from 'react'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, Search, Download, RefreshCw, User,  BadgeCheck, } from 'lucide-react'
import teacherService from '@/services/teacherService'
import type { Teacher } from '@/services/teacherService'

function Teachers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const data = await teacherService.getAllTeachers()
      setTeachers(data)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjectChoices.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesDepartment = selectedDepartment === 'all' || teacher.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  const departments = Array.from(new Set(teachers.map(teacher => teacher.department)))

  const downloadTeachersList = () => {
    const headers = ['Roll No', 'Name', 'Mobile No', 'Email', 'Department', 'Designation', 'Preferred Days', 'Subject Choices', 'Qualification', 'Joining Date', 'Status']
    const csvData = filteredTeachers.map(teacher => [
      teacher.rollNo,
      teacher.name,
      teacher.mobileNo,
      teacher.email,
      teacher.department,
      teacher.designation,
      teacher.preferredDays.join(', '),
      teacher.subjectChoices.join(', '),
      teacher.qualification || 'N/A',
      new Date(teacher.joiningDate).toLocaleDateString(),
      teacher.isVerified ? 'Verified' : 'Unverified'
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

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teacher Profiles</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={fetchTeachers} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={downloadTeachersList}>
              <Download className="w-4 h-4 mr-2" />
              Download List
            </Button>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, roll no, department, or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500">
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map(teacher => (
            <div key={teacher.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{teacher.name}</h3>
                      {teacher.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{teacher.designation}</p>
                    <p className="text-xs text-gray-500">Roll No: {teacher.rollNo}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-20">Department:</span>
                    <span className="font-medium">{teacher.department}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-20">Mobile:</span>
                    <span>{teacher.mobileNo}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-20">Email:</span>
                    <span className="truncate">{teacher.email}</span>
                  </div>

                  <div className="flex items-start text-sm">
                    <span className="text-gray-600 w-20">Subjects:</span>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjectChoices.map((subject, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start text-sm">
                    <span className="text-gray-600 w-20">Preferred:</span>
                    <div className="flex flex-wrap gap-1">
                      {teacher.preferredDays.map((day, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  {teacher.qualification && (
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600 w-20">Qualification:</span>
                      <span>{teacher.qualification}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-20">Joined:</span>
                    <span>{new Date(teacher.joiningDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-20">Status:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      teacher.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {teacher.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between">
                  <Button variant="ghost" className="text-sm" onClick={() => window.location.href = `mailto:${teacher.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="ghost" className="text-sm" onClick={() => window.location.href = `tel:${teacher.mobileNo}`}>
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
            <p className="text-gray-500">
              {searchQuery || selectedDepartment !== 'all' 
                ? 'No teachers found matching your criteria.' 
                : 'No teachers found.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Teachers