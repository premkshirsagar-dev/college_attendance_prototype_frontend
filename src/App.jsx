// App.jsx — Admin-only app.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./src/pages/auth/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
import ManageTeachers from "./src/pages/ManageTeachers";
import TeacherForm from "./src/pages/TeacherForm";
import ManageAdmins from "./src/pages/ManageAdmins";
import AdminForm from "./src/pages/AdminForm";
import ManageStudents from "./src/pages/teacher/ManageStudents";
import StudentForm from "./src/pages/teacher/StudentForm";
import TakeAttendance from "./src/pages/teacher/TakeAttendance";
import AttendanceRecords from "./src/pages/teacher/AttendanceRecords";

function App() {
  const allowRegister = import.meta.env.VITE_ALLOW_ADMIN_REGISTER !== "false";

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {allowRegister && <Route path="/register" element={<Register />} />}

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/teachers" element={<ProtectedRoute><ManageTeachers /></ProtectedRoute>} />
          <Route path="/teachers/add" element={<ProtectedRoute><TeacherForm /></ProtectedRoute>} />
          <Route path="/teachers/edit/:id" element={<ProtectedRoute><TeacherForm /></ProtectedRoute>} />

          <Route path="/admins" element={<ProtectedRoute><ManageAdmins /></ProtectedRoute>} />
          <Route path="/admins/add" element={<ProtectedRoute><AdminForm /></ProtectedRoute>} />
          <Route path="/admins/edit/:id" element={<ProtectedRoute><AdminForm /></ProtectedRoute>} />

          <Route path="/students" element={<ProtectedRoute><ManageStudents /></ProtectedRoute>} />
          <Route path="/students/add" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />
          <Route path="/students/edit/:id" element={<ProtectedRoute><StudentForm /></ProtectedRoute>} />

          <Route path="/attendance/take" element={<ProtectedRoute><TakeAttendance /></ProtectedRoute>} />
          <Route path="/attendance/records" element={<ProtectedRoute><AttendanceRecords /></ProtectedRoute>} />

          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
