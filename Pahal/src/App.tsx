import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Register from "./pages/auth/register"
import Login from "./pages/auth/login"
import Dashboard from "./pages/dashboard/dashboard"
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



function App() {
  return (
    <AttendanceProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/view-all-students" element={<StudentList />} />

            {/* Attendance Routes */}
            <Route path="/attendance">
              <Route index element={<Attendance />} />
              <Route path="markattendance" element={<MarkAttendance />} />
              <Route path="todayattendance" element={<TodayAttendance />} />
              <Route path="markteacherattendance" element={<MarkTeacherAttendance />} />
              <Route path="teacherattendance" element={<TeacherAttendance />} />
              <Route path="studentreports" element={<StudentReport />} />
              <Route path="todayteacherattendance" element={<TodayTeacherAttendance />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </AttendanceProvider>
  )
}

export default App
