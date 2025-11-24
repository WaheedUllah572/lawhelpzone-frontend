import { Download, Eye } from "lucide-react";

export default function DocumentCard({ title, date, onDownload, onView }) {
  return (
    <div className="glass-card flex justify-between items-center p-6 rounded-2xl transition-all hover:shadow-blue-800/30 border border-white/10 cursor-pointer">
      <div>
        <h3 className="card-title font-semibold text-lg mb-1">{title}</h3>
        <p className="card-date text-sm text-gray-400">{date}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onView}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Eye size={18} />
          View PDF
        </button>

        <button
          onClick={onDownload}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <Download size={18} />
          Download
        </button>
      </div>
    </div>
  );
}
