// pages/Unauthorized.jsx
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-2">403 Forbidden</h1>
      <p className="text-slate-600 mb-6">You are not authorized to access this page.</p>
      <Link to="/" className="text-brand-600 font-medium">← Back to home</Link>
    </div>
  </div>
);

export default Unauthorized;
