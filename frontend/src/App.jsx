import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Bugs from "./pages/Bugs";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="min-h-screen bg-slate-100">
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-5xl font-bold text-slate-900 mb-4">
                  DevTrack <span className="text-blue-600">AI</span> 🚀
                </h1>

                <p className="text-slate-600 text-lg max-w-xl mb-6">
                  A smart bug tracking system to manage projects, track bugs,
                  update status, and analyze development progress.
                </p>

                <div className="flex gap-4">
                  <a
                    href="/login"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    Login
                  </a>

                  <a
                    href="/register"
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800"
                  >
                    Register
                  </a>
                </div>
              </div>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bugs/:projectId"
            element={
              <ProtectedRoute>
                <Bugs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;