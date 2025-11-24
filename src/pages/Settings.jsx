import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Settings = () => {
  const [settings, setSettings] = useState({
    user_id: "default_user",
    openai_model: "gpt-4o-mini",
    theme: "dark",
    api_key: "",
    supabase_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5050/api/settings/")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaved(false);
    await fetch("http://127.0.0.1:5050/api/settings/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Loading settings...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-300">
          ⚙️ Application Settings
        </h1>

        <div className="space-y-5">
          {/* Model */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              OpenAI Model
            </label>
            <select
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-gray-100"
              value={settings.openai_model}
              onChange={(e) =>
                setSettings({ ...settings, openai_model: e.target.value })
              }
            >
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Theme
            </label>
            <select
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-gray-100"
              value={settings.theme}
              onChange={(e) =>
                setSettings({ ...settings, theme: e.target.value })
              }
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          {/* Supabase URL */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Supabase URL
            </label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-gray-100"
              value={settings.supabase_url || ""}
              onChange={(e) =>
                setSettings({ ...settings, supabase_url: e.target.value })
              }
            />
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              OpenAI API Key
            </label>
            <input
              type="password"
              className="w-full bg-gray-800 border border-gray-600 rounded-md p-3 text-gray-100"
              placeholder="sk-********"
              value={settings.api_key || ""}
              onChange={(e) =>
                setSettings({ ...settings, api_key: e.target.value })
              }
            />
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-lg font-semibold shadow-lg"
          >
            Save Changes
          </button>
          {saved && (
            <span className="text-green-400 text-sm animate-pulse">
              ✅ Settings saved!
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
