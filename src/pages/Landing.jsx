// pages/Landing.jsx
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2">
          College Attendance Management System
        </h1>
        <p className="text-slate-500 mb-10">
          Track attendance simply and accurately — for students and teachers.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-xl font-bold mb-4 text-brand-700">Student</h2>
            <div className="flex flex-col gap-3">
              <Link
                to="/login/student"
                className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                Student Login
              </Link>
              <Link
                to="/register/student"
                className="border border-brand-600 text-brand-600 hover:bg-brand-50 font-medium py-2.5 rounded-lg transition"
              >
                Student Registration
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-200">
            <h2 className="text-xl font-bold mb-4 text-brand-700">Teacher</h2>
            <div className="flex flex-col gap-3">
              <Link
                to="/login/teacher"
                className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition"
              >
                Teacher Login
              </Link>
<<<<<<< HEAD
              <p className="text-xs text-slate-400 pt-1">
                Teacher accounts are created by an administrator.
              </p>
=======
              <Link
                to="/register/teacher"
                className="border border-brand-600 text-brand-600 hover:bg-brand-50 font-medium py-2.5 rounded-lg transition"
              >
                Teacher Registration
              </Link>
>>>>>>> 20eaa273adac03fcae6db474676895e45d2b2401
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
