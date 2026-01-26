import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiPlus, FiEdit3 } from "react-icons/fi";
import SignatureModal from "../components/SignatureModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [docId, setDocId] = useState(null);
  const [showSignModal, setShowSignModal] = useState(false);

  const socketRef = useRef(null);
  const reconnectTimer = useRef(null);
  const chatEndRef = useRef(null);
  const greetedRef = useRef(false);
  const isConnectingRef = useRef(false);

  /* -------------------- WEBSOCKET -------------------- */
  const connectWebSocket = () => {
    if (
      socketRef.current &&
      socketRef.current.readyState !== WebSocket.CLOSED
    ) {
      return;
    }

    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    const wsUrl = API_BASE_URL.replace(/^http/, "ws") + "/api/chat";
    console.log("🔌 Connecting WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      isConnectingRef.current = false;
      clearTimeout(reconnectTimer.current);
    };

    ws.onmessage = (e) => {
      if (e.data === "__PING__") return;
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: "ai", text: e.data }]);
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onclose = () => {
      isConnectingRef.current = false;
      reconnectTimer.current = setTimeout(connectWebSocket, 5000);
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
    setMessages((p) => [...p, { sender: "user", text: msg }]);
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
      if (!res.ok) throw new Error(data.detail || "Upload failed");

      setDocId(data.doc_id);
      setMessages((p) => [
        ...p,
        { sender: "ai", text: `✅ File analyzed:\n\n${data.ai_summary}` },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        { sender: "ai", text: `❌ ${err.message}` },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- UI (UNCHANGED) -------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-black to-purple-950">
      <div className="relative flex flex-col w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5 shadow-2xl">

        <div className="text-center py-4 border-b border-white/10">
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
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "ml-auto bg-indigo-600 text-white"
                      : "bg-white/10 text-gray-200"
                  }`}
                >
                  {m.text}
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

        <div className="flex items-center gap-3 p-4 border-t border-white/10">
          <label className="p-2 rounded-full bg-indigo-700 hover:bg-indigo-600 cursor-pointer">
            <FiPlus />
            <input type="file" hidden onChange={handleFileUpload} />
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask a legal question..."
            className="flex-1 resize-none rounded-2xl px-4 py-2 bg-white/10 text-white outline-none"
            rows={1}
          />

          <button onClick={handleSend} className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500">
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
