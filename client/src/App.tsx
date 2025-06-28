import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Logout from "./pages/auth/logout";
import Dashboard from "./pages/dashboard/dashboard";
import Landing from "./pages/landing/landing";
import StudentList from "./pages/student/studentlist";
import Settings from "./pages/settings/settings";
import Gallery from "./pages/gallery/gallery";
import Contributors from "./pages/contributors/contributors";
import Syllabus from "./pages/syllabus/syllabus";
import Attendance from "./pages/attendance/attendance";
import MarkAttendance from "./pages/attendance/markattendance";
import TodayAttendance from "./pages/attendance/todayattendance";
import MarkTeacherAttendance from "./pages/attendance/markteacherattendance";
import TeacherAttendance from "./pages/attendance/teacherattendance";
import StudentReport from "./pages/attendance/studentreport";
import TodayTeacherAttendance from "./pages/attendance/todayteacherattendance";
import Teachers from "./pages/teacher/teachers";
import Homework from "./pages/homework/homework";
import { AttendanceProvider } from "./contexts/attendanceContext";
import { TeacherAuthProvider } from "./contexts/teacherAuthContext";
import { HomeworkProvider } from "./contexts/homeworkContext";
import { TeacherProtectedRoute } from "./components/auth/TeacherProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import TeacherManagement from "./pages/admin/TeacherManagement";
import TeacherVerification from "./pages/admin/TeacherVerification";
import AdminContributors from "./pages/admin/AdminContributors";
import AttendanceOverview from "./pages/admin/attendanceoverview";
import GalleryManagement from "./pages/admin/gallary";
import AdminSettings from "./pages/admin/settings";
import AttendanceDashboard from "./pages/attendance/attendanceDashboard";
import IndividualStudentReport from "./pages/attendance/individualStudentReport";
import IndividualTeacherReport from "./pages/attendance/individualTeacherReport";


function App() {
  return (
    <BrowserRouter>
      <TeacherAuthProvider>
        <AttendanceProvider>
          <HomeworkProvider>
            <div className="flex flex-col min-h-screen">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Protected Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="teachers" element={<TeacherManagement />} />
                  <Route path="verify-teachers" element={<TeacherVerification />} />
                  <Route path="contributors" element={<AdminContributors/>} />
                  <Route path="attendance" element={<AttendanceOverview/>} />
                   <Route path="gallary" element={<GalleryManagement/>} />
                   <Route path="settings" element={<AdminSettings/>} />

                  

                  {/* More nested routes can go here */}
                </Route>
                <Route
                  path="/dashboard"
                  element={
                    <TeacherProtectedRoute>
                      <Dashboard />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/teachers"
                  element={
                    <TeacherProtectedRoute>
                      <Teachers />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/homework"
                  element={
                    <TeacherProtectedRoute>
                      <Homework />
                    </TeacherProtectedRoute>
                  }
                />{" "}
                <Route
                  path="/view-all-students"
                  element={
                    <TeacherProtectedRoute>
                      <StudentList />
                    </TeacherProtectedRoute>
                  }
                />
                {/* Settings & Logout Routes */}{" "}
                <Route
                  path="/settings"
                  element={
                    <TeacherProtectedRoute>
                      <Settings />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/gallery"
                  element={
                    <TeacherProtectedRoute>
                      <Gallery />
                    </TeacherProtectedRoute>
                  }
                />{" "}
                <Route
                  path="/contributors"
                  element={
                    <TeacherProtectedRoute>
                      <Contributors />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/syllabus"
                  element={
                    <TeacherProtectedRoute>
                      <Syllabus />
                    </TeacherProtectedRoute>
                  }
                />
                <Route path="/logout" element={<Logout />} />
                {/* Attendance Routes */}
                <Route
                  path="/attendance"
                  element={
                    <TeacherProtectedRoute>
                      <Attendance />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/dashboard"
                  element={
                    <TeacherProtectedRoute>
                      <AttendanceDashboard />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/markattendance"
                  element={
                    <TeacherProtectedRoute>
                      <MarkAttendance />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/todayattendance"
                  element={
                    <TeacherProtectedRoute>
                      <TodayAttendance />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/markteacherattendance"
                  element={
                    <TeacherProtectedRoute>
                      <MarkTeacherAttendance />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/teacherattendance"
                  element={
                    <TeacherProtectedRoute>
                      <TeacherAttendance />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/studentreport"
                  element={
                    <TeacherProtectedRoute>
                      <StudentReport />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/student/:studentId/report"
                  element={
                    <TeacherProtectedRoute>
                      <IndividualStudentReport />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/teacher/:teacherId/report"
                  element={
                    <TeacherProtectedRoute>
                      <IndividualTeacherReport />
                    </TeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/todayteacherattendance"
                  element={
                    <TeacherProtectedRoute>
                      <TodayTeacherAttendance />
                    </TeacherProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </HomeworkProvider>
        </AttendanceProvider>
      </TeacherAuthProvider>
    </BrowserRouter>
  );
}

export default App;
