import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ElectionDetail from "./pages/ElectionDetail";
import CreateElection from "./pages/CreateElection";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/index.css";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/elections/:id" element={<ElectionDetail />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute adminOnly>
                  <CreateElection />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
