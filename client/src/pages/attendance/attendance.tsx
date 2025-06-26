import Layout from '@/components/layout/layout'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Attendance() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
        
        <div className="space-y-6">
          {/* Student Attendance Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Student Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/attendance/markattendance">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>Mark Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Take daily attendance for students
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/attendance/todayattendance">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>Today's Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      View and manage today's student attendance
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/attendance/studentreports">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>Student Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      View and download student attendance reports
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Teacher Attendance Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Teacher Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/attendance/markteacherattendance">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>Mark Teacher Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Take daily attendance for teachers
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/attendance/todayteacherattendance">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>Today's Teacher Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      View today's teacher attendance status
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/attendance/teacherattendance">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle>Teacher Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      View and download teacher attendance reports
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Attendance