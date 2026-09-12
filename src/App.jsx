// App.jsx
// All application routes are defined here.
// NOTE: Admin is intentionally NOT part of this app — it's a separate
// deployment (see /admin-frontend) so the public site has no trace of it.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/auth/Login";
import StudentRegister from "./pages/auth/StudentRegister";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ManageStudents from "./pages/teacher/ManageStudents";
import StudentForm from "./pages/teacher/StudentForm";
import TakeAttendance from "./pages/teacher/TakeAttendance";
import AttendanceRecords from "./pages/teacher/AttendanceRecords";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login/student" element={<Login role="student" />} />
          <Route path="/login/teacher" element={<Login role="teacher" />} />
          <Route path="/register/student" element={<StudentRegister />} />
          {/* No /register/teacher, no admin routes at all in this app */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student (protected) */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>
          } />

          {/* Teacher (protected) */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>
          } />
          <Route path="/teacher/students" element={
            <ProtectedRoute allowedRole="teacher"><ManageStudents /></ProtectedRoute>
          } />
          <Route path="/teacher/students/add" element={
            <ProtectedRoute allowedRole="teacher"><StudentForm /></ProtectedRoute>
          } />
          <Route path="/teacher/students/edit/:id" element={
            <ProtectedRoute allowedRole="teacher"><StudentForm /></ProtectedRoute>
          } />
          <Route path="/teacher/attendance/take" element={
            <ProtectedRoute allowedRole="teacher"><TakeAttendance /></ProtectedRoute>
          } />
          <Route path="/teacher/attendance/records" element={
            <ProtectedRoute allowedRole="teacher"><AttendanceRecords /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
