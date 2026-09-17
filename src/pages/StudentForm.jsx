// pages/StudentForm.jsx
// Shared Add / Edit student form for Admin. No email/password — students
// log in with just their Student ID. Only Student ID must be unique.

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import { CLASS_OPTIONS } from "../context/classes";

const StudentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentId: "", name: "", fatherName: "", motherName: "", class: CLASS_OPTIONS[0],
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/admin/students/${id}`);
        const { studentId, name, class: studentClass, fatherName, motherName } = res.data;
        setForm({
          studentId, name, class: studentClass,
          fatherName: fatherName || "", motherName: motherName || "",
        });
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
        await api.put(`/admin/students/${id}`, form);
        setMessage({ type: "success", text: "Student updated successfully." });
      } else {
        await api.post("/admin/students", form);
        setMessage({ type: "success", text: "Student added successfully." });
      }
      setTimeout(() => navigate("/students"), 900);
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
                name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} required
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name="name" placeholder="Student Name" value={form.name} onChange={handleChange} required
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name="fatherName" placeholder="Father's Name (optional)" value={form.fatherName} onChange={handleChange}
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name="motherName" placeholder="Mother's Name (optional)" value={form.motherName} onChange={handleChange}
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <select
                name="class" value={form.class} onChange={handleChange}
                className="border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
