import { BrowserRouter, Route, Routes } from "react-router-dom"
import Register from "./pages/auth/register"
import Login from "./pages/auth/login"
import Dashboard from "./pages/dashboard/dashboard"
import Landing from "./pages/landing/landing"
import StudentList from "./pages/student/studentlist"
import Attendance from "./pages/attendance/attendance"
import MarkAttendance from "./pages/attendance/markattendance"
import TodayAttendance from "./pages/attendance/todayattendance"
import MarkTeacherAttendance from "./pages/attendance/markteacherattendance"
import TeacherAttendance from "./pages/attendance/teacherattendance"
import StudentReport from "./pages/attendance/studentreport"
import TodayTeacherAttendance from "./pages/attendance/todayteacherattendance"
import Teachers from "./pages/teacher/teachers"
import { AttendanceProvider } from "./contexts/attendanceContext"
import { TeacherAuthProvider } from "./contexts/teacherAuthContext"
import { TeacherProtectedRoute } from "./components/auth/TeacherProtectedRoute"



function App() {
  return (
    <BrowserRouter>
      <TeacherAuthProvider>
        <AttendanceProvider>
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <TeacherProtectedRoute>
                  <Dashboard />
                </TeacherProtectedRoute>
              } />
              <Route path="/teachers" element={
                <TeacherProtectedRoute>
                  <Teachers />
                </TeacherProtectedRoute>
              } />
              <Route path="/view-all-students" element={
                <TeacherProtectedRoute>
                  <StudentList />
                </TeacherProtectedRoute>
              } />

              {/* Attendance Routes */}
              <Route path="/attendance" element={
                <TeacherProtectedRoute>
                  <Attendance />
                </TeacherProtectedRoute>
              } />
              <Route path="/attendance/markattendance" element={
                <TeacherProtectedRoute>
                  <MarkAttendance />
                </TeacherProtectedRoute>
              } />
              <Route path="/attendance/todayattendance" element={
                <TeacherProtectedRoute>
                  <TodayAttendance />
                </TeacherProtectedRoute>
              } />
              <Route path="/attendance/markteacherattendance" element={
                <TeacherProtectedRoute>
                  <MarkTeacherAttendance />
                </TeacherProtectedRoute>
              } />
              <Route path="/attendance/teacherattendance" element={
                <TeacherProtectedRoute>
                  <TeacherAttendance />
                </TeacherProtectedRoute>
              } />
              <Route path="/attendance/studentreports" element={
                <TeacherProtectedRoute>
                  <StudentReport />
                </TeacherProtectedRoute>
              } />
              <Route path="/attendance/todayteacherattendance" element={
                <TeacherProtectedRoute>
                  <TodayTeacherAttendance />
                </TeacherProtectedRoute>
              } />
            </Routes>
          </div>
        </AttendanceProvider>
      </TeacherAuthProvider>
    </BrowserRouter>
  )
}

export default App
