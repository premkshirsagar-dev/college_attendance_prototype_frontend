// pages/teacher/StudentForm.jsx
// Shared Add / Edit student form. If :id is present in the URL, it's edit mode.

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";

import { CLASS_OPTIONS } from "../../context/classes";
const StudentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", password: "", enrollmentNumber: "", class: CLASS_OPTIONS[0],
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/teacher/students/${id}`);
        const { name, email, enrollmentNumber, class: studentClass } = res.data;
        setForm({ name, email, password: "", enrollmentNumber, class: studentClass });
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load student." });
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      if (isEdit) {
        const { password, ...updateData } = form; // password not editable here (per spec: hashed password never shown/edited via this form)
        await api.put(`/teacher/students/${id}`, updateData);
        setMessage({ type: "success", text: "Student updated successfully." });
      } else {
        await api.post("/teacher/students", form);
        setMessage({ type: "success", text: "Student added successfully." });
      }
      setTimeout(() => navigate("/teacher/students"), 900);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title={isEdit ? "Edit Student" : "Add Student"} />
      <div className="max-w-lg mx-auto px-4 sm:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {message && <div className="mb-4"><Alert type={message.type} message={message.text} /></div>}
          {loading ? (
            <Alert type="info" message="Loading..." />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {!isEdit && (
                <input
                  name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength={6}
                  className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              )}
              <input
                name="enrollmentNumber" placeholder="Enrollment Number" value={form.enrollmentNumber} onChange={handleChange} required
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <select
                name="class" value={form.class} onChange={handleChange}
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <button
                type="submit" disabled={saving}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
              >
                {saving ? "Loading..." : isEdit ? "Save Changes" : "Add Student"}
              </button>
            </form>
          )}
        </div>

        <Link to="/teacher/students" className="text-brand-600 font-medium text-sm mt-6 inline-block">
          ← Back to Manage Students
        </Link>
      </div>
    </div>
  );
};

export default StudentForm;
