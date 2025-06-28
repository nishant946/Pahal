import Layout from '@/components/layout/layout'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Users, GraduationCap } from 'lucide-react'

function Attendance() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>
        
        <div className="space-y-6">
          {/* Dashboard Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Dashboard & Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/attendance/dashboard">
                <Card className="hover:bg-gray-50 transition-colors cursor-pointer border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Attendance Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      View comprehensive attendance overview and statistics
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Student Attendance Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Student Attendance
            </h2>
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

              <Link to="/attendance/studentreport">
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
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Teacher Attendance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/attendance/markteacherattendance" tabIndex={-1} title="Coming soon">
                <Card className="hover:bg-gray-50 transition-colors cursor-not-allowed opacity-50 relative">
                  <CardHeader>
                    <CardTitle>Mark Teacher Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Take daily attendance for teachers
                    </p>
                    <span className="absolute top-2 right-2 text-xs text-gray-400">(Coming soon)</span>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/attendance/todayteacherattendance" tabIndex={-1} title="Coming soon">
                <Card className="hover:bg-gray-50 transition-colors cursor-not-allowed opacity-50 relative">
                  <CardHeader>
                    <CardTitle>Today's Teacher Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      View today's teacher attendance status
                    </p>
                    <span className="absolute top-2 right-2 text-xs text-gray-400">(Coming soon)</span>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/attendance/teacherattendance" tabIndex={-1} title="Coming soon">
                <Card className="hover:bg-gray-50 transition-colors cursor-not-allowed opacity-50 relative">
                  <CardHeader>
                    <CardTitle>Teacher Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      View and download teacher attendance reports
                    </p>
                    <span className="absolute top-2 right-2 text-xs text-gray-400">(Coming soon)</span>
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