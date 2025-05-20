import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Search, Calendar } from 'lucide-react'
import { useAttendance } from '@/contexts/attendanceContext'

function MarkAttendance() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');
  const { students, todayAttendance, markStudentAttendance, unmarkStudentAttendance } = useAttendance();
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.includes(searchQuery) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPresent = (studentId: string) => 
    todayAttendance.presentStudents.some(student => student.id === studentId);

  const toggleAttendance = (studentId: string) => {
    if (isPresent(studentId)) {
      unmarkStudentAttendance(studentId);
    } else {
      markStudentAttendance(studentId);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/attendance')}>
              Back
            </Button>
            <h1 className="text-2xl font-bold">Mark Student Attendance</h1>
          </div>
          <div className="text-gray-600">
            <Calendar className="w-4 h-4 inline-block mr-1" />
            {currentDate}
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:space-y-6">
          {/* Search Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by name, roll no, or group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-blue-700 font-semibold text-sm sm:text-base">Total Students</h3>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">{students.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-green-700 font-semibold text-sm sm:text-base">Present</h3>
              <p className="text-xl sm:text-2xl font-bold text-green-900">
                {todayAttendance.presentStudents.length}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="text-red-700 font-semibold text-sm sm:text-base">Absent</h3>
              <p className="text-xl sm:text-2xl font-bold text-red-900">
                {students.length - todayAttendance.presentStudents.length}
              </p>
            </div>
          </div>

          {/* Table/List Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            {/* Desktop View */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 font-semibold border-b bg-gray-50 rounded-t-xl">
              <div className="col-span-2">Roll No</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Grade</div>
              <div className="col-span-3">Group</div>
              <div className="col-span-2">Attendance</div>
            </div>

            {/* Mobile and Desktop Views */}
            {filteredStudents.length === 0 ? (
              <div className="p-4 sm:p-8 text-center text-gray-500">
                No students found matching your search.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className={`p-4 transition-colors ${
                      isPresent(student.id) ? 'bg-green-50/50' : ''
                    }`}
                  >
                    {/* Mobile View */}
                    <div className="sm:hidden space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">Roll No: {student.rollNumber}</p>
                          <p className="text-sm text-gray-600">Grade: {student.grade}</p>
                          <p className="text-sm text-gray-600">Group: {student.group}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={isPresent(student.id)}
                            onCheckedChange={() => toggleAttendance(student.id)}
                            id={`attendance-mobile-${student.id}`}
                          />
                          <Label 
                            htmlFor={`attendance-mobile-${student.id}`} 
                            className={`text-sm font-medium ${
                              isPresent(student.id) ? 'text-green-600' : 'text-gray-600'
                            }`}
                          >
                            {isPresent(student.id) ? 'Present' : 'Absent'}
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2 font-medium text-gray-600">{student.rollNumber}</div>
                      <div className="col-span-3">{student.name}</div>
                      <div className="col-span-2">{student.grade}</div>
                      <div className="col-span-3">{student.group}</div>
                      <div className="col-span-2 flex items-center gap-2">
                        <Switch
                          checked={isPresent(student.id)}
                          onCheckedChange={() => toggleAttendance(student.id)}
                          id={`attendance-${student.id}`}
                        />
                        <Label 
                          htmlFor={`attendance-${student.id}`} 
                          className={`text-sm font-medium ${
                            isPresent(student.id) ? 'text-green-600' : 'text-gray-600'
                          }`}
                        >
                          {isPresent(student.id) ? 'Present' : 'Absent'}
                        </Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default MarkAttendance;