import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiPlus, FiMic, FiEdit3 } from "react-icons/fi";
import SignatureModal from "../components/SignatureModal";
import "../styles/chat.css";

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
  const chatEndRef = useRef(null);
  const greetedRef = useRef(false);
  const reconnectTimer = useRef(null);
  let recognitionRef = useRef(null);

  // 🧠 Initialize WebSocket (no language parameter)
  const connectWebSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.hostname;
    const port = 5050;
    const wsUrl = `${protocol}://${host}:${port}/api/chat`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected:", wsUrl);
    ws.onclose = () => {
      console.warn("⚠️ WebSocket disconnected. Reconnecting in 2s...");
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = setTimeout(connectWebSocket, 2000);
    };
    ws.onmessage = (e) => {
      setIsTyping(false);
      const text = e.data;
      if (text === "__PING__") return;
      const newMsg = { sender: "ai", text };
      setMessages((p) => [...p, newMsg]);
      saveChat([...messages, newMsg]);
    };
  };

  // 🎙️ Speech Recognition (English only)
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interim += transcript;
      }
      setInterimText(interim);
      if (finalTranscript.trim()) {
        setInput(finalTranscript.trim());
        handleSend(finalTranscript.trim());
      }
    };

    recognition.onerror = (e) => console.error("🎙️ Mic error:", e);
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  };

  // 📡 Init + Greet
  useEffect(() => {
    connectWebSocket();
    if (!greetedRef.current) {
      greetedRef.current = true;
      setTimeout(() => {
        setMessages([
          {
            sender: "ai",
            text:
              "👋 Hello! I’m LawHelpZone, your AI Legal Assistant. How can I assist you today?",
          },
        ]);
      }, 600);
    }
    return () => {
      clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
    };
  }, []);

  // 💾 Save Chat
  const saveChat = async (msgs) => {
    try {
      const joined = msgs
        .map((m) => `${m.sender === "user" ? "👤" : "🤖"} ${m.text}`)
        .join("\n\n");
      await fetch("http://localhost:5050/api/save/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "LawHelpZone Chat Session",
          content: joined,
          user_id: "guest",
        }),
      });
    } catch (err) {
      console.warn("⚠️ Failed to save chat:", err);
    }
  };

  // 📎 Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessages((p) => [
      ...p,
      { sender: "ai", text: `📂 Uploading "${file.name}" and analyzing...` },
    ]);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:5050/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setDocId(data.doc_id);
        setMessages((p) => [
          ...p,
          {
            sender: "ai",
            text: `✅ File "${file.name}" analyzed successfully:\n\n${data.ai_summary}`,
          },
        ]);
      } else {
        setMessages((p) => [
          ...p,
          { sender: "ai", text: `⚠️ Upload failed: ${data.detail}` },
        ]);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSend = (msgText = input) => {
    if (!msgText.trim()) return;
    const msg = { sender: "user", text: msgText.trim() };
    setMessages((p) => [...p, msg]);
    socketRef.current?.send(msgText.trim());
    setInput("");
    setIsTyping(true);
    saveChat([...messages, msg]);
  };

  const handleKeyPress = (e) =>
    e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-page-container flex items-center justify-center min-h-screen">
      <div className="glass-chat-box relative flex flex-col w-full max-w-3xl h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="chat-header text-center py-4 bg-black/20 border-b border-white/10 flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-indigo-300 tracking-wide">
            ⚖️ LawHelpZone AI Assistant
          </h1>
          <p className="text-sm text-gray-400">
            Ask about laws, rights, upload a document, or use your voice.
          </p>
        </div>

        <div id="chat-box" className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
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

          {uploading && (
            <div className="text-gray-400 text-sm">🧠 Analyzing document...</div>
          )}
          {isTyping && (
            <div className="text-indigo-400 text-sm animate-pulse">
              🤖 LawHelpZone is typing...
            </div>
          )}
          {interimText && listening && (
            <div className="text-gray-400 italic text-sm">{interimText}</div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area flex items-center gap-3 p-4 border-t border-white/10 bg-black/20">
          <label
            htmlFor="file-upload"
            className="btn-icon bg-gradient-to-br from-indigo-700 to-blue-700 hover:scale-105 cursor-pointer"
          >
            <FiPlus />
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a legal question, upload a file, or use the mic..."
            className="flex-1 resize-none rounded-2xl px-4 py-2 bg-white/10 text-white placeholder-gray-400"
            rows={1}
          />
          <button
            onClick={handleSend}
            className="btn-icon bg-gradient-to-r from-indigo-600 to-blue-600"
          >
            <FiSend />
          </button>
          <button
            onClick={listening ? stopListening : startListening}
            className={`btn-icon ${
              listening ? "bg-red-600" : "bg-white/10 hover:bg-white/20"
            }`}
            title={listening ? "Stop Listening" : "Start Voice Input"}
          >
            <FiMic />
          </button>
        </div>

        {showSignModal && (
          <SignatureModal docId={docId} onClose={() => setShowSignModal(false)} />
        )}
      </div>
    </div>
  );
}
