import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import Logout from "./pages/auth/logout";
import PendingVerification from "./pages/auth/pending-verification";
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
// import { TeacherProtectedRoute } from "./components/auth/TeacherProtectedRoute";
import VerifiedTeacherProtectedRoute from "./components/auth/VerifiedTeacherProtectedRoute";
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
                <Route
                  path="/pending-verification"
                  element={<PendingVerification />}
                />
                {/* Protected Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="teachers" element={<TeacherManagement />} />
                  <Route
                    path="verify-teachers"
                    element={<TeacherVerification />}
                  />
                  <Route path="contributors" element={<AdminContributors />} />
                  <Route path="attendance" element={<AttendanceOverview />} />
                  <Route path="gallary" element={<GalleryManagement />} />
                  <Route path="settings" element={<AdminSettings />} />

                  {/* More nested routes can go here */}
                </Route>
                <Route
                  path="/dashboard"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <Dashboard />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/teachers"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <Teachers />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/homework"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <Homework />
                    </VerifiedTeacherProtectedRoute>
                  }
                />{" "}
                <Route
                  path="/view-all-students"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <StudentList />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                {/* Settings & Logout Routes */}{" "}
                <Route
                  path="/profile"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <Settings />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/gallery"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <Gallery />
                    </VerifiedTeacherProtectedRoute>
                  }
                />{" "}
                <Route
                  path="/contributors"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <Contributors />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/syllabus"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <Syllabus />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route path="/logout" element={<Logout />} />
                {/* Attendance Routes */}
                <Route
                  path="/attendance"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <Attendance />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/dashboard"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <AttendanceDashboard />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/markattendance"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <MarkAttendance />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/todayattendance"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <TodayAttendance />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/markteacherattendance"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <MarkTeacherAttendance />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/teacherattendance"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <TeacherAttendance />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/studentreport"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <StudentReport />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/student/:studentId/report"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <IndividualStudentReport />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/teacher/:teacherId/report"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <IndividualTeacherReport />
                    </VerifiedTeacherProtectedRoute>
                  }
                />
                <Route
                  path="/attendance/todayteacherattendance"
                  element={
                    <VerifiedTeacherProtectedRoute>
                      <TodayTeacherAttendance />
                    </VerifiedTeacherProtectedRoute>
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
