import { useState, useEffect } from "react";
import DocumentCard from "../../components/DocumentCard";
import { motion } from "framer-motion";
import { auth } from "../../firebase";
import "../../styles/documents.css";

export default function MyDocuments() {
  const [documents, setDocuments] = useState([]);

  const fetchDocs = async (uid) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save/list?user_id=${uid}`);
  const data = await res.json();
  setDocuments(data.documents || []);
};

const handleDelete = async (id) => {
  await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save/delete/${id}`, { method: "DELETE" });
};

const handleView = async (id) => {
  window.open(`${import.meta.env.VITE_API_BASE_URL}/api/save/pdf/${id}`, "_blank");
};


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchDocs(user.uid);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen px-6 md:px-12 py-10 bg-gradient-to-br from-[#0b0f1a] via-[#11182a] to-[#1b203a] text-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold tracking-tight text-blue-200 mb-3"
      >
        My Documents
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              title={doc.title}
              date={doc.created_at}
              onDownload={() => handleDelete(doc.id)}
              onView={() => handleView(doc.id)}
            />
          ))
        ) : (
          <p className="text-gray-500">No documents saved yet.</p>
        )}
      </div>
    </div>
  );
}
