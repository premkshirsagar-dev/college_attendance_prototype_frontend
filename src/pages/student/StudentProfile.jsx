// pages/student/StudentProfile.jsx
// Read-only by design — students cannot edit their own profile (per spec).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Alert from "../../components/Alert";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/student/profile");
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar title="My Profile" />
      <div className="max-w-lg mx-auto px-4 sm:px-8 py-8">
        {loading && <Alert type="info" message="Loading..." />}
        {error && <Alert type="error" message={error} />}

        {profile && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col gap-4 text-sm">
              <Field label="Full Name" value={profile.name} />
              <Field label="Email" value={profile.email} />
              <Field label="Enrollment Number" value={profile.enrollmentNumber} />
              <Field label="Class" value={profile.class} />
            </div>
            <p className="text-xs text-slate-400 mt-6">
              Profile details can only be updated by your teacher/administrator.
            </p>
          </div>
        )}

        <Link to="/student/dashboard" className="text-brand-600 font-medium text-sm mt-6 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

const Field = ({ label, value }) => (
  <div className="flex justify-between border-b border-slate-100 pb-3">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-800">{value}</span>
  </div>
);

export default StudentProfile;
