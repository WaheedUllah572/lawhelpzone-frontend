import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Generate document (AI-powered)
export const generateDocument = async (formData) => {
  try {
    const response = await api.post("/generate", formData);
    return response.data;
  } catch (error) {
    console.error("❌ AI generation failed:", error);
    throw error.response?.data?.detail || "Failed to generate document.";
  }
};

// ✅ Other API exports can go below as needed
export default api;
