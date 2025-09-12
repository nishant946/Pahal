import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import teacherService from '@/services/teacherService'
import type { Teacher } from '@/services/teacherService'

interface TeacherWithAttendance extends Teacher {
  isPresent: boolean;
  timeMarked?: string;
}

function MarkTeacherAttendance() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState<TeacherWithAttendance[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [markingAttendance, setMarkingAttendance] = useState(false)
  const [todayDate] = useState(new Date().toISOString().split('T')[0])

  // Fetch all teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true)
        const teachersData = await teacherService.getAllTeachers()
        
        // Get today's attendance to see who's already marked
        try {
          const todayAttendance = await teacherService.getPresentTeachersByDate(todayDate)
          const presentTeacherIds = new Set(todayAttendance.presentTeachers.map(t => t.id))
          
          const teachersWithAttendance = teachersData.map(teacher => ({
            ...teacher,
            isPresent: presentTeacherIds.has(teacher._id),
            timeMarked: todayAttendance.presentTeachers.find(t => t.id === teacher._id)?.timeMarked
          }))
          
          setTeachers(teachersWithAttendance)
        } catch (error) {
          // If no attendance data exists yet, mark all as absent
          const teachersWithAttendance = teachersData.map(teacher => ({
            ...teacher,
            isPresent: false
          }))
          setTeachers(teachersWithAttendance)
        }
      } catch (error) {
        console.error('Error fetching teachers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [todayDate])

  // const filteredTeachers = teachers.filter(teacher =>
  //   teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   teacher.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
  // )
    // Filter teachers
  const filteredTeachers = teachers
    .filter(teacher =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchQuery.toLowerCase())
    )
    // ✅ Sort alphabetically by teacher name
    .sort((a, b) => a.name.localeCompare(b.name));


  const markAttendance = async (teacherId: string, status: 'present' | 'absent') => {
    try {
      setMarkingAttendance(true)
      
      if (status === 'present') {
        const timeMarked = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        
        await teacherService.markTeacherAttendance({
          teacherId,
          date: todayDate,
          status: 'present',
          timeMarked,
          timeIn: timeMarked
        })
        
        setTeachers(prev => prev.map(teacher => 
          teacher._id === teacherId 
            ? { ...teacher, isPresent: true, timeMarked }
            : teacher
        ))
      } else {
        // For absent, we don't create a record, just update the UI
        setTeachers(prev => prev.map(teacher => 
          teacher._id === teacherId 
            ? { ...teacher, isPresent: false, timeMarked: undefined }
            : teacher
        ))
      }
    } catch (error) {
      console.error('Error marking attendance:', error)
      alert('Failed to mark attendance. Please try again.')
    } finally {
      setMarkingAttendance(false)
    }
  }

  const unmarkAttendance = async (teacherId: string) => {
    try {
      setMarkingAttendance(true)
      await teacherService.unmarkTeacherAttendance(teacherId, todayDate)
      
      setTeachers(prev => prev.map(teacher => 
        teacher._id === teacherId 
          ? { ...teacher, isPresent: false, timeMarked: undefined }
          : teacher
      ))
    } catch (error) {
      console.error('Error unmarking attendance:', error)
      alert('Failed to unmark attendance. Please try again.')
    } finally {
      setMarkingAttendance(false)
    }
  }

  const presentCount = teachers.filter(t => t.isPresent).length
  const absentCount = teachers.filter(t => !t.isPresent).length

if (loading) {
  return (
    <Layout>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
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
          <div className="text-sm text-gray-600">
            Date: {new Date(todayDate).toLocaleDateString()}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teachers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search teachers by name, employee ID, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map(teacher => (
            <Card key={teacher._id} className={`${teacher.isPresent ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <p className="text-sm text-gray-600">{teacher.rollNo}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    teacher.isPresent 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {teacher.isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{teacher.department}</p>
                  <p>{teacher.designation}</p>
                </div>
                {teacher.timeMarked && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Clock className="w-3 h-3" />
                    {teacher.timeMarked}
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  {teacher.isPresent ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => teacher._id && unmarkAttendance(teacher._id)}
                      disabled={markingAttendance}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Unmark
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => teacher._id && markAttendance(teacher._id, 'present')}
                      disabled={markingAttendance}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Present
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
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

export default MarkTeacherAttendance