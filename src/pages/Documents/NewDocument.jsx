import { useState } from "react";
import { motion } from "framer-motion";
import DocumentForm from "../../components/DocumentForm";
import DocumentPreview from "../../components/DocumentPreview";
import "../../styles/documents.css";
import { generateDocument } from "../../api/axios";
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

  const generatePreview = async () => {
    if (!formData.partyA || !formData.partyB) {
      alert("Please fill Party A and Party B.");
      return;
    }
    setLoading(true);
    try {
      const res = await generateDocument(formData);
      setAiText(res.content);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Login required");

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `${formData.type} Agreement`,
        content: aiText,
        user_id: user.uid,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Document saved!");
      navigate("/documents");
    } else {
      alert(data.detail);
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-12 py-12">
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <DocumentForm
          formData={formData}
          setFormData={setFormData}
          generatePreview={generatePreview}
          loading={loading}
        />
        <DocumentPreview formData={formData} aiText={aiText} onSave={handleSave} />
      </motion.div>
    </div>
  );
}
