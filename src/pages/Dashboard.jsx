import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { FileText, MessageSquare, FolderOpen, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const cards = [
    {
      title: "Draft Legal Documents",
      text: "Quickly generate NDAs, contracts, or legal forms using AI.",
      icon: <FileText size={30} />,
      link: "/documents/new",
    },
    {
      title: "AI Legal Assistant",
      text: "Chat with your assistant for legal queries and quick guidance.",
      icon: <MessageSquare size={30} />,
      link: "/chat",
    },
    {
      title: "Saved Documents",
      text: "Access previously generated files securely from your dashboard.",
      icon: <FolderOpen size={30} />,
      link: "/documents",
    },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 md:p-10"
      >
        <div className="text-center mt-10 md:mt-4">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 mb-4">
            Welcome to LawHelpZone
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Generate legal documents instantly or chat with our AI Legal Assistant.
          </p>

          {/* Top Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/chat"
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-lg"
            >
              <PlusCircle size={18} /> Start a New Chat
            </Link>
            <Link
              to="/documents"
              className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
            >
              View Documents
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {cards.map((card, idx) => (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              key={idx}
              className="card group hover:shadow-xl border border-transparent bg-white/60 dark:bg-gray-800/70 backdrop-blur-xl p-6 rounded-2xl transition-all relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-3 text-indigo-500 dark:text-indigo-400">
                {card.icon}
                <h3 className="text-lg font-semibold">{card.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {card.text}
              </p>
              <Link
                to={card.link}
                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-sm"
              >
                Explore →
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
}
