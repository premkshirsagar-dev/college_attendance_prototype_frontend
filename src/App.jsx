// App.jsx — Public app (Student + Teacher only). Admin lives in a
// completely separate app/repo and has no presence here.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/auth/Login";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ManageStudents from "./pages/ManageStudents";
import TakeAttendance from "./pages/teacher/TakeAttendance";
import AttendanceRecords from "./pages/teacher/AttendanceRecords";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login/student" element={<Login role="student" />} />
          <Route path="/login/teacher" element={<Login role="teacher" />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>
          } />

          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>
          } />
          <Route path="/teacher/students" element={
            <ProtectedRoute allowedRole="teacher"><ManageStudents /></ProtectedRoute>
          } />
          <Route path="/teacher/attendance/take" element={
            <ProtectedRoute allowedRole="teacher"><TakeAttendance /></ProtectedRoute>
          } />
          <Route path="/teacher/attendance/records" element={
            <ProtectedRoute allowedRole="teacher"><AttendanceRecords /></ProtectedRoute>
          } />

          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
