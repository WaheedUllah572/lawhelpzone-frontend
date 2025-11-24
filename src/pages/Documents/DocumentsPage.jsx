import { motion } from "framer-motion";
import DocumentCard from "../../components/DocumentCard";

export default function DocumentsPage() {
  const docs = [
    { title: "Non-Disclosure Agreement", date: "Nov 5, 2025" },
    { title: "Employment Contract", date: "Nov 6, 2025" },
    { title: "Tenancy Agreement", date: "Nov 7, 2025" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#111a2f] to-[#18254a] text-gray-100 p-6 md:p-12 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Page Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-200 mb-3">
            My Documents
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            View, download, or manage your generated legal documents here.
          </p>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {docs.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <DocumentCard title={doc.title} date={doc.date} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
