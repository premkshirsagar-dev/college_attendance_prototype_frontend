// components/StatCard.jsx
const StatCard = ({ label, value, accent = "text-brand-600" }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-1">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`text-3xl font-bold ${accent}`}>{value}</span>
  </div>
);

export default StatCard;
