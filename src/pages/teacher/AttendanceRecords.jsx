// pages/teacher/AttendanceRecords.jsx
// Two tabs: filterable attendance history (Records), and a ranked
// leaderboard of students by attendance % for a month or year (Rankings).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";

const CLASS_OPTIONS = ["", "BCA 1st Year", "BCA 2nd Year", "BCA 3rd Year"];
const STATUS_OPTIONS = ["", "Present", "Absent"];
const RANKINGS_CLASS_OPTIONS = ["BCA 1st Year", "BCA 2nd Year", "BCA 3rd Year"];

const currentMonthISO = () => new Date().toISOString().slice(0, 7);
const currentYear = () => new Date().getFullYear().toString();

const AttendanceRecords = () => {
  const [activeTab, setActiveTab] = useState("records");

  const [filters, setFilters] = useState({ class: "", date: "", status: "" });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rankClass, setRankClass] = useState(RANKINGS_CLASS_OPTIONS[0]);
  const [periodType, setPeriodType] = useState("month");
  const [month, setMonth] = useState(currentMonthISO());
  const [year, setYear] = useState(currentYear());
  const [rankSearch, setRankSearch] = useState("");
  const [rankings, setRankings] = useState([]);
  const [rankLoading, setRankLoading] = useState(false);
  const [rankError, setRankError] = useState(null);

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

  const fetchRankings = async () => {
    setRankLoading(true);
    setRankError(null);
    try {
      const params = { class: rankClass };
      if (periodType === "month") params.month = month;
      else params.year = year;
      const res = await api.get("/teacher/attendance/rankings", { params });
      setRankings(res.data);
    } catch (err) {
      setRankError(err.response?.data?.message || "Failed to load rankings.");
    } finally {
      setRankLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "records") fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, activeTab]);

  useEffect(() => {
    if (activeTab === "rankings") fetchRankings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankClass, periodType, month, year, activeTab]);

  const visibleRankings = rankings.filter((r) => {
    if (!rankSearch) return true;
    const q = rankSearch.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.enrollmentNumber.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="Attendance Records" />
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">

        <div className="flex gap-2 mb-6 bg-white rounded-xl border border-slate-200 p-1 w-fit">
          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "records" ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Records
          </button>
          <button
            onClick={() => setActiveTab("rankings")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === "rankings" ? "bg-brand-600 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Rankings
          </button>
        </div>

        {activeTab === "records" && (
          <>
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
          </>
        )}

        {activeTab === "rankings" && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col gap-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <select
                  value={rankClass}
                  onChange={(e) => setRankClass(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {RANKINGS_CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="month">By Month</option>
                  <option value="year">By Year</option>
                </select>

                {periodType === "month" ? (
                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                ) : (
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2026"
                    className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                )}
              </div>

              <input
                placeholder="Search by name or enrollment number..."
                value={rankSearch}
                onChange={(e) => setRankSearch(e.target.value)}
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {rankError && <Alert type="error" message={rankError} />}
            {rankLoading && <Alert type="info" message="Loading..." />}

            {!rankLoading && !rankError && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead className="bg-slate-50 text-slate-500 text-left">
                    <tr>
                      <th className="px-6 py-3 font-medium">Rank</th>
                      <th className="px-6 py-3 font-medium">Enrollment</th>
                      <th className="px-6 py-3 font-medium">Student</th>
                      <th className="px-6 py-3 font-medium">Present / Total</th>
                      <th className="px-6 py-3 font-medium">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRankings.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No attendance data for this period.</td></tr>
                    )}
                    {visibleRankings.map((r, index) => (
                      <tr key={r.studentId} className="border-t border-slate-100">
                        <td className="px-6 py-3 text-slate-400 font-medium">#{index + 1}</td>
                        <td className="px-6 py-3">{r.enrollmentNumber}</td>
                        <td className="px-6 py-3 font-medium">{r.name}</td>
                        <td className="px-6 py-3 text-slate-500">{r.present} / {r.total}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            r.percentage >= 75 ? "bg-green-100 text-green-700"
                              : r.percentage >= 50 ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {r.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <Link to="/teacher/dashboard" className="text-brand-600 font-medium text-sm mt-6 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AttendanceRecords;
