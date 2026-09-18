// pages/teacher/TeacherDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import Alert from "../../components/Alert";

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/teacher/dashboard");
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Teacher Dashboard" />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        {loading && <Alert type="info" message="Loading..." />}
        {error && <Alert type="error" message={error} />}

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Students" value={stats.totalStudents} />
            <StatCard label="Present Today" value={stats.presentToday} accent="text-green-600" />
            <StatCard label="Absent Today" value={stats.absentToday} accent="text-red-600" />
            <StatCard label="Attendance %" value={`${stats.attendancePercentage}%`} />
          </div>
        )}

         <div className="grid sm:grid-cols-2 gap-4">
          <NavCard to="/teacher/students" title="Students" desc="View, search & filter students in your classes" />
          <NavCard to="/teacher/attendance/take" title="Take Attendance" desc="Mark today's (or any date's) attendance by class" />
          <NavCard to="/teacher/attendance/records" title="Attendance Records" desc="Browse & filter historical attendance, view rankings" />
          <NavCard to="/teacher/attendance/midway-leavers" title="Midway Leavers" desc="Students flagged as leaving partway through the day" />
        </div>
      </div>
    </div>
  );
};

const NavCard = ({ to, title, desc }) => (
  <Link
    to={to}
    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-brand-400 hover:shadow-md transition"
  >
    <h3 className="font-semibold text-brand-700">{title}</h3>
    <p className="text-sm text-slate-500 mt-1">{desc}</p>
  </Link>
);

export default TeacherDashboard;
