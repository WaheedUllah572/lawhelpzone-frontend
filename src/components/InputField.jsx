import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

export default function InputField({ label, type, value, setValue }) {
  const [show, setShow] = useState(false);
  const actualType = type === "password" && show ? "text" : type;

  return (
    <div className="input-wrapper mb-5 relative">
      {/* Input Field */}
      <input
        type={actualType}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder=" "
        className="peer w-full pl-11 pr-10 py-3 rounded-xl border border-gray-500 dark:border-gray-700 
                   bg-white/98 dark:bg-gray-900/80 text-gray-950 dark:text-gray-100 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />

      {/* Floating Label */}
      <label
        className="absolute left-11 top-3 text-gray-700 dark:text-gray-400 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                   peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-700 
                   dark:peer-focus:text-indigo-400 bg-transparent pointer-events-none font-medium"
      >
        {label}
      </label>

      {/* Left Icon */}
      {type === "email" && (
        <Mail
          className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none"
          size={18}
        />
      )}
      {type === "password" && (
        <Lock
          className="absolute left-3 top-3 text-gray-500 dark:text-gray-400 pointer-events-none"
          size={18}
        />
      )}

      {/* Eye Toggle Icon */}
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-indigo-400 transition"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}
