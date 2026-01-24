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

  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const chatEndRef = useRef(null);
  const greetedRef = useRef(false);

  /* -------------------- WEBSOCKET -------------------- */
  const connectWebSocket = () => {
    if (!API_BASE_URL) return;

    const wsUrl = API_BASE_URL.replace("https://", "wss://") + "/api/chat";
    console.log("🔌 Connecting WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (e) => {
      if (e.data === "__PING__") return;
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "ai", text: e.data }]);
    };

    ws.onclose = () => {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = setTimeout(connectWebSocket, 3000);
    };
  };

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    connectWebSocket();

    if (!greetedRef.current) {
      greetedRef.current = true;
      setMessages([
        {
          sender: "ai",
          text: "👋 Hello! I’m LawHelpZone, your AI Legal Assistant. How can I assist you today?",
        },
      ]);
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
      setIsTyping(false);
    }
  };

  /* -------------------- FILE UPLOAD -------------------- */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessages((p) => [
      ...p,
      { sender: "ai", text: `📂 Uploading "${file.name}"...` },
    ]);

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
      }
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- UI -------------------- */
  return (
    <div className="chat-page-container flex items-center justify-center min-h-screen">
      <div className="glass-chat-box relative flex flex-col w-full max-w-3xl h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="chat-header text-center py-4 bg-black/20 border-b border-white/10">
          <h1 className="text-2xl font-bold text-indigo-300">
            ⚖️ LawHelpZone AI Assistant
          </h1>
          <p className="text-sm text-gray-400">
            Ask about laws, rights, or upload a document
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`message-bubble ${
                    m.sender === "user" ? "bubble-user" : "bubble-ai"
                  }`}
                >
                  {m.text}
                  {i === messages.length - 1 && m.sender === "ai" && docId && (
                    <button
                      onClick={() => setShowSignModal(true)}
                      className="mt-3 text-sm bg-indigo-700 hover:bg-indigo-600 px-3 py-1.5 rounded-lg text-white flex items-center gap-1"
                    >
                      <FiEdit3 /> Review & Sign
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="text-indigo-400 text-sm animate-pulse">
              🤖 LawHelpZone is typing...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area flex items-center gap-3 p-4 border-t border-white/10 bg-black/20">
          <label className="btn-icon bg-indigo-700 hover:bg-indigo-600 cursor-pointer">
            <FiPlus />
            <input type="file" hidden onChange={handleFileUpload} />
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a legal question..."
            className="flex-1 resize-none rounded-2xl px-4 py-2 bg-white/10 text-white"
            rows={1}
          />

          <button
            onClick={handleSend}
            className="btn-icon bg-indigo-600 hover:bg-indigo-500"
          >
            <FiSend />
          </button>
        </div>

        {showSignModal && (
          <SignatureModal
            docId={docId}
            onClose={() => setShowSignModal(false)}
          />
        )}
      </div>
    </div>
  );
}
