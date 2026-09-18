// pages/teacher/TakeAttendance.jsx
// Teacher selects a class + date + session (Noon/Afternoon), marks each
// student Present/Absent, and submits. Afternoon overwrites Noon's
// stored result; anyone Present at Noon but Absent in the Afternoon
// check is flagged as having left midway.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";
import { CLASS_OPTIONS } from "../../constants/classes";

const todayISO = () => new Date().toISOString().slice(0, 10);
const SESSION_OPTIONS = ["Noon", "Afternoon"];

const TakeAttendance = () => {
  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[0]);
  const [date, setDate] = useState(todayISO());
  const [session, setSession] = useState("Noon");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [midwayLeavers, setMidwayLeavers] = useState([]);

  const loadClassRoster = async () => {
    setLoading(true);
    setMessage(null);
    setMidwayLeavers([]);
    try {
      const res = await api.get("/teacher/attendance/class-students", {
        params: { class: selectedClass, date },
      });
      setStudents(res.data.map((s) => ({ ...s, status: s.status || "Present" })));
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to load students." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassRoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, date]);

  const setStatus = (studentId, status) => {
    setStudents((prev) => prev.map((s) => (s.studentId === studentId ? { ...s, status } : s)));
  };

  const markAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);
    setMidwayLeavers([]);
    try {
      const res = await api.post("/teacher/attendance", {
        class: selectedClass,
        date,
        session,
        attendance: students.map((s) => ({ studentId: s.studentId, status: s.status })),
      });
      setMessage({ type: "success", text: res.data.message });
      if (res.data.midwayLeavers && res.data.midwayLeavers.length > 0) {
        setMidwayLeavers(res.data.midwayLeavers);
      }
      loadClassRoster();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Submission failed." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Take Attendance" />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-medium">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium">Date</label>
            <input
              type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 font-medium">Session</label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {SESSION_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {session === "Afternoon" && (
          <div className="mb-4">
            <Alert type="info" message="Afternoon is the final recheck — this will overwrite today's Noon attendance. Anyone Present at Noon but marked Absent now will be flagged as having left midway." />
          </div>
        )}

        {message && <div className="mb-4"><Alert type={message.type} message={message.text} /></div>}

        {midwayLeavers.length > 0 && (
          <div className="mb-4">
            <Alert
              type="error"
              message={`Left midway: ${midwayLeavers.map((m) => `${m.name} (${m.studentCode})`).join(", ")}`}
            />
          </div>
        )}

        {loading && <Alert type="info" message="Loading..." />}

        {!loading && students.length > 0 && (
          <>
            <div className="flex gap-3 mb-4">
              <button onClick={() => markAll("Present")} className="text-sm font-medium px-4 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200">
                Mark All Present
              </button>
              <button onClick={() => markAll("Absent")} className="text-sm font-medium px-4 py-2 rounded-lg bg-red-50 text-red-700 border border-red-200">
                Mark All Absent
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto mb-6">
              <table className="w-full text-sm min-w-[520px]">
                <thead className="bg-slate-50 text-slate-500 text-left">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Student ID</th>
                    <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Student Name</th>
                    <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">Last Marked</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.studentId} className="border-t border-slate-100">
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{s.studentCode}</td>
                      <td className="px-4 sm:px-6 py-3 font-medium whitespace-nowrap">{s.name}</td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={s.status === "Present"}
                            onChange={(e) => setStatus(s.studentId, e.target.checked ? "Present" : "Absent")}
                            className="w-5 h-5 accent-green-600 cursor-pointer"
                          />
                          <span className={`text-sm font-medium ${s.status === "Present" ? "text-green-700" : "text-red-700"}`}>
                            {s.status}
                          </span>
                        </label>
                      </td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-slate-400 text-xs">
                        {s.session || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition"
            >
              {submitting ? "Loading..." : `Submit ${session} Attendance`}
            </button>
          </>
        )}

        {!loading && students.length === 0 && (
          <Alert type="info" message="No students found in this class." />
        )}

        <div className="mt-6">
          <Link to="/teacher/dashboard" className="text-brand-600 font-medium text-sm">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;
