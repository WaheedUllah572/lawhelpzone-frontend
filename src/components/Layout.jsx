import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex bg-gradient-to-br from-[#0b1020] via-[#11182a] to-[#1b203a] text-gray-100 transition-colors duration-500 overflow-hidden min-h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-500 ${
          sidebarOpen ? "md:ml-60" : "md:ml-20"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-[50] mt-[4rem] px-5 sm:px-8 md:px-10 pb-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
