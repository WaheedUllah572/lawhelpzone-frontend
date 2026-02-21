import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/chat", label: "Chatbot", icon: <MessageCircle size={20} /> },
    { to: "/documents", label: "Documents", icon: <FileText size={20} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* 🔥 Backdrop (Mobile Only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen flex flex-col
          bg-white/90 dark:bg-gray-900/95 backdrop-blur-2xl
          border-r border-white/20 dark:border-gray-800
          shadow-xl
          transition-transform duration-300 ease-in-out
          z-50

          w-60

          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-white/10 dark:border-gray-800">
          <h1 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
            LawHelpZone
          </h1>

          {/* Close button only on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <ul className="flex-1 overflow-y-auto px-3 pt-4 space-y-1">
          {links.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setOpen(false)} // auto close on mobile
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  location.pathname === item.to
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-blue-100/40 dark:hover:bg-gray-800"
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10 dark:border-gray-800">
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-100 dark:hover:bg-gray-800 text-red-500 transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}