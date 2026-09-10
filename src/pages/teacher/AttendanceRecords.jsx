// pages/teacher/AttendanceRecords.jsx
// Filterable attendance history: by class, date, status.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";

const CLASS_OPTIONS = ["", "BCA 1st Year", "BCA 2nd Year", "BCA 3rd Year"];
const STATUS_OPTIONS = ["", "Present", "Absent"];

const AttendanceRecords = () => {
  const [filters, setFilters] = useState({ class: "", date: "", status: "" });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.class) params.class = filters.class;
      if (filters.date) params.date = filters.date;
      if (filters.status) params.status = filters.status;
      const res = await api.get("/teacher/attendance", { params });
      setRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Attendance Records" />
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 grid sm:grid-cols-3 gap-4">
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
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {error && <Alert type="error" message={error} />}
        {loading && <Alert type="info" message="Loading..." />}

        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-6 py-3 font-medium">Enrollment</th>
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Class</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No records found.</td></tr>
                )}
                {records.map((r) => (
                  <tr key={r._id} className="border-t border-slate-100">
                    <td className="px-6 py-3">{r.studentId?.enrollmentNumber}</td>
                    <td className="px-6 py-3 font-medium">{r.studentId?.name}</td>
                    <td className="px-6 py-3">{r.class}</td>
                    <td className="px-6 py-3">{r.date}</td>
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
        )}

        <Link to="/teacher/dashboard" className="text-brand-600 font-medium text-sm mt-6 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AttendanceRecords;
