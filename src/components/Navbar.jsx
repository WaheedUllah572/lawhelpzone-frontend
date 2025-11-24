import { Link } from "react-router-dom";
import { Menu, Bell } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-[70] backdrop-blur-2xl bg-white/60 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-800 shadow-[0_2px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_20px_rgba(0,0,0,0.2)] transition-all duration-500">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 tracking-tight">
            LawHelpZone
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/chat" className="nav-link">
            Chatbot
          </Link>

          <button className="relative text-gray-700 dark:text-gray-300 hover:text-indigo-500 transition">
            <Bell size={20} />
            <span className="absolute top-[-4px] right-[-4px] bg-indigo-500 w-2.5 h-2.5 rounded-full"></span>
          </button>

          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-red-500 font-medium transition"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}
