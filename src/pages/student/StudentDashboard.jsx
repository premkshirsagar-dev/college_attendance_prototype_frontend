// pages/student/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import Alert from "../../components/Alert";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get("/student/attendance");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load attendance.");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Student Dashboard" />
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-800">Welcome, {user?.name}</h2>
          <p className="text-slate-500 text-sm mt-1">
            Student ID: <span className="font-medium">{user?.studentId}</span> &nbsp;·&nbsp; Class:{" "}           
            <span className="font-medium">{user?.class}</span>
          </p>
        </div>

        {loading && <Alert type="info" message="Loading..." />}
        {error && <Alert type="error" message={error} />}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="Overall Attendance" value={`${data.percentage}%`} />
              <StatCard label="Total Classes" value={data.totalClasses} accent="text-slate-700" />
              <StatCard label="Present" value={data.present} accent="text-green-600" />
              <StatCard label="Absent" value={data.absent} accent="text-red-600" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <h3 className="text-lg font-semibold px-6 pt-5 pb-3">Attendance History</h3>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-left">
                  <tr>
                    <th className="px-6 py-2 font-medium">Date</th>
                    <th className="px-6 py-2 font-medium">Class</th>
                    <th className="px-6 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-6 text-center text-slate-400">No attendance records yet.</td></tr>
                  )}
                  {data.history.map((r) => (
                    <tr key={r._id} className="border-t border-slate-100">
                      <td className="px-6 py-3">{r.date}</td>
                      <td className="px-6 py-3">{r.class}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          r.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="flex gap-4 mt-6">
          <Link to="/student/profile" className="text-brand-600 font-medium text-sm">My Profile →</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
