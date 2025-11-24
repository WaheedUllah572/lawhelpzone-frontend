import { motion } from "framer-motion";
import { FileText, Globe, Calendar, Users } from "lucide-react";

export default function DocumentForm({
  formData,
  setFormData,
  clearForm,
  generatePreview,
  loading,
}) {
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <motion.div
      initial={{ opacity: 0, x: -25 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card-modern p-8 rounded-2xl space-y-6 border border-white/10 shadow-[0_4px_40px_rgba(59,130,246,0.05)]"
    >
      <h2 className="text-2xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
        <FileText size={20} /> Document Details
      </h2>

      <div>
        <label className="block text-gray-300 mb-1">Document Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="input-modern"
        >
          <option>NDA</option>
          <option>Employment Contract</option>
          <option>Affidavit</option>
          <option>Tenancy Agreement</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Party A</label>
        <input
          type="text"
          name="partyA"
          value={formData.partyA}
          onChange={handleChange}
          placeholder="Enter name of Party A"
          className="input-modern"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1">Party B</label>
        <input
          type="text"
          name="partyB"
          value={formData.partyB}
          onChange={handleChange}
          placeholder="Enter name of Party B"
          className="input-modern"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1 flex items-center gap-1">
          <Calendar size={16} /> Effective Date
        </label>
        <input
          type="date"
          name="effectiveDate"
          value={formData.effectiveDate}
          onChange={handleChange}
          className="input-modern"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1 flex items-center gap-1">
          <Globe size={16} /> Country
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter country"
          className="input-modern"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-1 flex items-center gap-1">
          <Users size={16} /> Custom Clauses
        </label>
        <textarea
          name="clauses"
          value={formData.clauses}
          onChange={handleChange}
          placeholder="Add custom clauses..."
          rows={4}
          className="input-modern resize-none"
        />
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button onClick={clearForm} type="button" className="btn-secondary-modern">
          Clear
        </button>
        <button
          type="button"
          onClick={generatePreview}
          disabled={loading}
          className={`btn-primary-modern ${loading ? "opacity-70" : ""}`}
        >
          {loading ? "Generating..." : "Generate Preview"}
        </button>
      </div>
    </motion.div>
  );
}
