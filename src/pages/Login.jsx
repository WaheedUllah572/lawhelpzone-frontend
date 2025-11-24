import { useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden auth-glow">
      <Toaster position="top-center" />

      {/* Soft gradient glow layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-purple-600/15 blur-[120px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card z-10 rounded-3xl p-10 w-[90%] max-w-md text-center"
      >
        <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 mb-3">
          Welcome Back
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          Log in to continue to{" "}
          <span className="font-semibold text-blue-700 dark:text-blue-400">
            LawHelpZone
          </span>
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <InputField
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            setValue={setPassword}
          />

          <button
            type="submit"
            className="btn-primary w-full mt-6 text-lg py-3 font-semibold"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="btn-google mt-4 font-medium"
        >
          <FcGoogle size={22} /> Continue with Google
        </button>

        <p className="text-gray-700 dark:text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-700 dark:text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
