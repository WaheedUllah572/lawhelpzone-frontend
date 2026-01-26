import { useState, useRef, useEffect } from "react";

export default function SignatureModal({ docId, onClose }) {
  const [signer, setSigner] = useState("");
  const [file, setFile] = useState(null);
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  /* ---------------------------- DRAWING LOGIC ---------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches)
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      return { x: e.offsetX, y: e.offsetY };
    };

    const start = (e) => {
      e.preventDefault();
      isDrawing.current = true;
      const pos = getPos(e);
      lastPoint.current = pos;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const pos = getPos(e);

      // ✨ smooth interpolation for natural handwriting
      const midX = (lastPoint.current.x + pos.x) / 2;
      const midY = (lastPoint.current.y + pos.y) / 2;
      ctx.quadraticCurveTo(
        lastPoint.current.x,
        lastPoint.current.y,
        midX,
        midY
      );
      ctx.stroke();
      lastPoint.current = pos;
    };

    const stop = () => {
      if (isDrawing.current) {
        ctx.closePath();
        isDrawing.current = false;
      }
    };

    // 🖱️ Mouse events
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);

    // 📱 Touch events
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stop, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stop);
    };
  }, []);

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  /* ---------------------------- UPLOAD HANDLER ---------------------------- */
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("doc_id", docId);
    formData.append("signer_name", signer);

    const uploadForm = (form) => {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/sign`, {
  method: "POST",
  body: form,
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || "Document signed successfully!");
          onClose();
        })
        .catch((err) => {
          console.error("Error signing:", err);
          alert("Error signing document.");
        });
    };

    if (file) {
formData.append("file", file);
      uploadForm(formData);
    } else {
      // convert drawn signature to PNG blob
      const canvas = canvasRef.current;
      canvas.toBlob((blob) => {
        if (blob) {
          formData.append("file", blob, "signature.png");

        } else {
          alert("Please draw or upload a signature before saving.");
        }
      });
    }
  };

  /* ---------------------------- UI ---------------------------- */
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="signature-modal bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 w-[420px] shadow-2xl border border-indigo-500/30">
        <h2 className="text-xl font-semibold text-indigo-300 mb-4 text-center">
          🔏 Sign Document
        </h2>

        <label className="block text-sm text-gray-300 mb-2">
          Your Full Name
        </label>
        <input
          type="text"
          value={signer}
          onChange={(e) => setSigner(e.target.value)}
          placeholder="Enter your name"
          className="w-full mb-4 p-2 rounded-md bg-white/10 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <label className="block text-sm text-gray-300 mb-2">
          Upload your signature (PNG)
        </label>
        <input
          type="file"
          accept="image/png"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full text-gray-300"
        />

        <label className="block text-sm text-gray-300 mb-2">
          Or draw your signature
        </label>
        <canvas
          ref={canvasRef}
          width="360"
          height="100"
          className="bg-white rounded-md mb-4 border border-gray-500 shadow-inner"
        ></canvas>

        <div className="flex justify-between items-center mt-3">
          <button
            onClick={clearCanvas}
            className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1.5 rounded-md text-white transition-all"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-500 text-sm px-4 py-1.5 rounded-md text-white shadow-md transition-all"
          >
            Sign & Save
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
