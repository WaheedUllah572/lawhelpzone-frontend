import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import MyDocuments from "./pages/Documents/MyDocuments";
import NewDocument from "./pages/Documents/NewDocument";
import Settings from "./pages/Settings"; // ✅ NEW import

// 🔒 Private route wrapper
const PrivateRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <PrivateRoute>
              <MyDocuments />
            </PrivateRoute>
          }
        />

        <Route
          path="/documents/new"
          element={
            <PrivateRoute>
              <NewDocument />
            </PrivateRoute>
          }
        />

        {/* ✅ Added new Settings route */}
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
