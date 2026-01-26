import { useState } from "react";
import { motion } from "framer-motion";
import DocumentForm from "../../components/DocumentForm";
import DocumentPreview from "../../components/DocumentPreview";
import "../../styles/documents.css";
import { generateDocument } from "../../api/axios"; // Backend integration
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function NewDocument() {
  const [formData, setFormData] = useState({
    type: "NDA",
    partyA: "",
    partyB: "",
    effectiveDate: "",
    country: "United States",
    clauses: "",
  });

  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState("");
  const navigate = useNavigate();

  const clearForm = () => {
    setFormData({
      type: "NDA",
      partyA: "",
      partyB: "",
      effectiveDate: "",
      country: "United States",
      clauses: "",
    });
    setAiText("");
  };

  // ✅ Generate preview with AI
  const generatePreview = async () => {
    if (!formData.partyA || !formData.partyB) {
      alert("Please fill Party A and Party B before generating preview.");
      return;
    }

    setLoading(true);
    try {
      const res = await generateDocument(formData);
      setAiText(res.content);
    } catch (err) {
      alert("Error generating document: " + err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save finalized document
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to save your documents.");
      return;
    }
    if (!aiText.trim()) {
      alert("Please generate the document preview before saving.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: `${formData.type} Agreement between ${formData.partyA} and ${formData.partyB}`,
    content: aiText,
    user_id: user.uid,
  }),
});


      const data = await res.json();
      if (res.ok) {
        alert("✅ Document saved successfully!");
        navigate("/documents"); // ✅ Redirect after save
      } else {
        alert("Error saving document: " + data.detail);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("An error occurred while saving the document.");
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-12 bg-gradient-to-br from-[#0a0f1d] via-[#101a31] to-[#1a2242] text-gray-100 transition-all duration-700">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 mb-4"
      >
        Create New Document
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-gray-400 mb-12 text-lg max-w-2xl leading-relaxed"
      >
        Instantly draft and preview your legal documents powered by AI. Customize
        every clause, preview changes in real-time, and export beautifully formatted PDFs.
      </motion.p>

      {/* Main Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        <DocumentForm
          formData={formData}
          setFormData={setFormData}
          clearForm={clearForm}
          generatePreview={generatePreview}
          loading={loading}
        />
        <DocumentPreview
          formData={formData}
          aiText={aiText}
          onSave={handleSave} // ✅ pass save handler to preview
        />
      </motion.div>

      {/* Floating Glow Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[40%] left-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>
    </div>
  );
}
