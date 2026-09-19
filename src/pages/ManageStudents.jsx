// pages/teacher/ManageStudents.jsx
// VIEW-ONLY student list for Teacher — needed to see who's in a class
// before taking attendance. Add/Edit/Delete are Admin-only (see the
// separate admin-frontend app's ManageStudents page).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";
import { CLASS_OPTIONS as ALL_CLASSES } from "../../context/classes";

const CLASS_OPTIONS = ["All Classes", ...ALL_CLASSES];

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/teacher/students", {
        params: { search: search || undefined, class: classFilter },
      });
      setStudents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(fetchStudents, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, classFilter]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Students" />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            placeholder="Search by name or student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5 flex-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {error && <Alert type="error" message={error} />}
        {loading && <Alert type="info" message="Loading..." />}

        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-3">
            Total Students: <span className="font-semibold text-slate-700">{students.length}</span>
          </p>
        )}

        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-slate-50 text-slate-500 text-left">
                <tr>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Student ID</th>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Name</th>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Father's Name</th>
                  <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Class</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No students found.</td></tr>
                )}
                {students.map((s) => (
                  <tr key={s._id} className="border-t border-slate-100">
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{s.studentId}</td>
                    <td className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">{s.name}</td>
                    <td className="px-4 sm:px-6 py-3 text-slate-500 whitespace-nowrap">{s.fatherName || "—"}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{s.class}</td>
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

export default ManageStudents;
