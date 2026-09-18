// pages/teacher/MidwayLeavers.jsx
// Log of students flagged as having left midway — Present at Noon,
// Absent by the Afternoon recheck. Filterable by class and date.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";
import { CLASS_OPTIONS as ALL_CLASSES } from "../../context/classes";

const CLASS_OPTIONS = ["", ...ALL_CLASSES];

const MidwayLeavers = () => {
  const [filters, setFilters] = useState({ class: "", date: "" });
  const [leavers, setLeavers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeavers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.class) params.class = filters.class;
      if (filters.date) params.date = filters.date;
      const res = await api.get("/teacher/attendance/midway-leavers", { params });
      setLeavers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load midway leavers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeavers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Midway Leavers" />
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <p className="text-sm text-slate-500 mb-6">
          Students marked Present at Noon but Absent during the Afternoon recheck — likely left partway through the day.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 grid sm:grid-cols-2 gap-4">
          <select
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Classes</option>
            {CLASS_OPTIONS.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {error && <Alert type="error" message={error} />}
        {loading && <Alert type="info" message="Loading..." />}

        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-3">
            Total flagged: <span className="font-semibold text-slate-700">{leavers.length}</span>
          </p>
        )}

        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Student ID</th>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Student</th>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Class</th>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Date</th>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Flagged At</th>
                </tr>
              </thead>
              <tbody>
                {leavers.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No midway leavers recorded.</td></tr>
                )}
                {leavers.map((l) => (
                  <tr key={l._id} className="border-t border-slate-100">
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{l.studentId?.studentId}</td>
                    <td className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">{l.studentId?.name}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{l.class}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{l.date}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-slate-500">
                      {new Date(l.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/teacher/dashboard" className="text-brand-600 font-medium text-sm mt-6 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default MidwayLeavers;
