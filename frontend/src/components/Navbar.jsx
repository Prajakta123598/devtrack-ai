import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold">
          DevTrack <span className="text-blue-400">AI</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-400">
                Dashboard
              </Link>

              <Link to="/projects" className="hover:text-blue-400">
                Projects
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;