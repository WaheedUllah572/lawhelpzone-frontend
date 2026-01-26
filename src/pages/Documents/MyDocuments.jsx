import { useState, useEffect } from "react";
import DocumentCard from "../../components/DocumentCard";
import { motion } from "framer-motion";
import { auth } from "../../firebase";
import "../../styles/documents.css";

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);

  const fetchDocs = async (uid) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/list?user_id=${uid}`);
    const data = await res.json();
    setDocuments(data.documents || []);
  };

  const handleDelete = async (id) => {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/delete/${id}`, { method: "DELETE" });
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleView = (id) => {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/api/upload/pdf/${id}`, "_blank");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchDocs(user.uid);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen px-6 md:px-12 py-10">
      <motion.h1 className="text-4xl font-extrabold text-blue-200 mb-3">
        My Documents
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            title={doc.title}
            date={doc.created_at}
            onDownload={() => handleDelete(doc.id)}
            onView={() => handleView(doc.id)}
          />
        ))}
      </div>
    </div>
  );
}
