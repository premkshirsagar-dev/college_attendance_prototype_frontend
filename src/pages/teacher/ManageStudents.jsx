// pages/ManageStudents.jsx
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
  const [message, setMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/students", {
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

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/students/${deleteTarget._id}`);
      setMessage({ type: "success", text: "Student deleted successfully." });
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete student." });
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Manage Students" />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
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
          <Link
            to="/students/add"
            className="bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-lg text-center transition whitespace-nowrap"
          >
            + Add Student
          </Link>
        </div>

        {message && <div className="mb-4"><Alert type={message.type} message={message.text} /></div>}
        {error && <Alert type="error" message={error} />}
        {loading && <Alert type="info" message="Loading..." />}

        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-3">
            Total Students: <span className="font-semibold text-slate-700">{students.length}</span>
          </p>
        )}

        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-slate-50 text-slate-500 text-left">
               <tr>
                  <th className="px-6 py-3 font-medium">Student ID</th>
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Father's Name</th>
                  <th className="px-6 py-3 font-medium">Class</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No students found.</td></tr>
                )}
                {students.map((s) => (
                  <tr key={s._id} className="border-t border-slate-100">
                    <td className="px-6 py-3">{s.studentId}</td>
                    <td className="px-6 py-3 font-medium">{s.name}</td>
                    <td className="px-6 py-3 text-slate-500">{s.fatherName || "—"}</td>
                    <td className="px-6 py-3">{s.class}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Link to="/dashboard" className="text-brand-600 font-medium text-sm mt-6 inline-block">
          ← Back to Dashboard
        </Link>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-slate-800 mb-2">Are you sure you want to delete this student?</h3>
            <p className="text-sm text-slate-500 mb-6">{deleteTarget.name} ({deleteTarget.enrollmentNumber}) will be permanently removed, along with their attendance records.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
