import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 py-8 text-center text-gray-400 border-t border-gray-700">
      <div className="flex justify-center gap-6 text-sm">

        <Link to="/privacy-policy" className="hover:text-white">
          Privacy Policy
        </Link>

        <Link to="/disclaimer" className="hover:text-white">
          Disclaimer
        </Link>

        <Link to="/terms" className="hover:text-white">
          Terms of Service
        </Link>

        <a href="mailto:support@lawhelpzone.org" className="hover:text-white">
          Contact
        </a>

      </div>
    </footer>
  );
}