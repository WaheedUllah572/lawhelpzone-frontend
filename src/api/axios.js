import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/api`
    : "http://localhost:5050/api",
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

export default api;
