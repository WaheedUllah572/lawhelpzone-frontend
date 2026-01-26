import { motion } from "framer-motion";
import { FileText, Loader2, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

export default function DocumentPreview({ formData, aiText }) {
  const [exporting, setExporting] = useState(false);
  const [docId, setDocId] = useState(null);
  const [signedPdfUrl, setSignedPdfUrl] = useState(null);

  const handleSave = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${formData.type} — ${formData.country}`,
          content: aiText || "No AI-generated text available.",
        }),
      });
      const data = await res.json();
      setDocId(data.doc_id);
      alert("Document saved successfully!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save document.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!docId) return alert("Please save the document first!");
    setExporting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload/pdf/${docId}`
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.type}_${formData.country}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("PDF generation failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
      className="glass-card-modern p-8 rounded-2xl overflow-y-auto max-h-[80vh] border border-white/10 shadow-[0_4px_40px_rgba(37,99,235,0.05)]">

      <h2 className="text-2xl font-semibold text-blue-100 mb-4 flex items-center gap-2">
        <FileText size={20} /> Preview
      </h2>

      <div className="bg-[#0b0f1a] p-6 rounded-xl text-gray-300 border border-white/5"
        style={{ fontFamily: "Inter, sans-serif", fontSize: "13.5px", lineHeight: "1.7" }}>

        <h3 className="text-lg font-semibold mb-3 text-blue-200">
          {formData.type} — {formData.country}
        </h3>

        <ReactMarkdown>{aiText}</ReactMarkdown>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button onClick={handleSave} className="btn-secondary-modern">Save</button>
        <button onClick={handleDownloadPDF} disabled={exporting}
          className="btn-primary-modern flex items-center gap-2">
          {exporting ? <><Loader2 className="animate-spin" size={16} /> Building PDF...</> :
            <><Download size={16} /> Download PDF</>}
        </button>
      </div>
    </motion.div>
  );
}
