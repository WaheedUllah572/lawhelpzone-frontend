import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiPlus, FiMic, FiEdit3 } from "react-icons/fi";
import SignatureModal from "../components/SignatureModal";
import "../styles/chat.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docId, setDocId] = useState(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");

  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const chatEndRef = useRef(null);
  const greetedRef = useRef(false);
  const recognitionRef = useRef(null);

  /* -------------------- WEBSOCKET -------------------- */
  const connectWebSocket = () => {
    if (!API_BASE_URL) {
      console.error("❌ VITE_API_BASE_URL is missing");
      return;
    }

    const wsUrl = API_BASE_URL.replace("https://", "wss://") + "/api/chat";
    console.log("🔌 Connecting WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (e) => {
      if (e.data === "__PING__") return;
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "ai", text: e.data }]);
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket disconnected. Reconnecting in 3s...");
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = setTimeout(connectWebSocket, 3000);
    };
  };

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    connectWebSocket();

    if (!greetedRef.current) {
      greetedRef.current = true;
      setTimeout(() => {
        setMessages([
          {
            sender: "ai",
            text: "👋 Hello! I’m LawHelpZone, your AI Legal Assistant. How can I assist you today?",
          },
        ]);
      }, 500);
    }

    return () => {
      clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
    };
  }, []);

  /* -------------------- SEND MESSAGE -------------------- */
  const handleSend = () => {
    if (!input.trim()) return;

    const msg = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      console.warn("⚠️ WebSocket not ready, message skipped");
      setIsTyping(false);
    }
  };

  /* -------------------- FILE UPLOAD -------------------- */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessages((p) => [...p, { sender: "ai", text: `📂 Uploading ${file.name}...` }]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setDocId(data.doc_id);
        setMessages((p) => [
          ...p,
          { sender: "ai", text: `✅ File analyzed:\n\n${data.ai_summary}` },
        ]);
      } else {
        throw new Error(data.detail);
      }
    } catch (err) {
      setMessages((p) => [...p, { sender: "ai", text: `❌ Upload failed` }]);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- UI -------------------- */
  return (
    <div className="chat-page-container">
      <div className="glass-chat-box">
        <div className="chat-header">
          <h1>⚖️ LawHelpZone AI Assistant</h1>
          <p>Ask about laws, rights, or upload a document</p>
        </div>

        <div className="chat-body">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className={`bubble ${m.sender}`}>{m.text}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input">
          <label>
            <FiPlus />
            <input type="file" hidden onChange={handleFileUpload} />
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a legal question..."
          />

          <button onClick={handleSend}>
            <FiSend />
          </button>
        </div>

        {showSignModal && (
          <SignatureModal docId={docId} onClose={() => setShowSignModal(false)} />
        )}
      </div>
    </div>
  );
}
