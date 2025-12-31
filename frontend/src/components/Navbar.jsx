import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import Logo from "./Logo";

const Navbar = () => {
  const { isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserInfo({
            username: payload.username || null,
            email: payload.email || null,
            role: payload.role || "USER",
          });
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Don't render until auth state is determined
  if (loading) {
    return (
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "linear-gradient(180deg,#071122,#0b1220)",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-clip-border"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                    boxShadow: "0 2px 4px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 3h14v2H5zM7 7h10v2H7zM3 11h18v10H3z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-200">
                  Smart Parking
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const initials = (userInfo?.username || userInfo?.email || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const maskEmail = (e) => {
    if (!e) return "";
    const [name, domain] = e.split("@");
    const short = name.length > 10 ? name.slice(0, 8) + "…" : name;
    return `${short}@${domain}`;
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "linear-gradient(180deg,#1e293b,#0f172a)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-md bg-clip-border"
                style={{
                  background: "linear-gradient(180deg,#111827,#0b1220)",
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 3h14v2H5zM7 7h10v2H7zM3 11h18v10H3z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-200">
                Smart Parking
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
                >
                  <div className="avatar" title={userInfo?.email || "Profile"}>
                    {initials}
                  </div>
                  <div className="text-sm text-gray-200">
                    <div className="font-medium">
                      {userInfo?.username ||
                        (userInfo?.email || "").split("@")[0] ||
                        "User"}
                    </div>
                    <div className="text-xs text-muted">
                      {maskEmail(userInfo?.email)}
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
