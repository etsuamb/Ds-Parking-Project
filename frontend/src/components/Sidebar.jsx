import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

const HomeIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 3.172L2 9v7a1 1 0 001 1h4a1 1 0 001-1V12h2v5a1 1 0 001 1h4a1 1 0 001-1V9l-8-5.828z" />
  </svg>
);
const ParkingIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13 5H8a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1v-3a1 1 0 00-1-1h-3v-4h3a1 1 0 001-1V7a1 1 0 00-1-1h-3V5z" />
  </svg>
);
const DashboardIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zM13 21h8v-10h-8v10zm0-18v6h8V3h-8z" />
  </svg>
);
// Simple list icon for My Bookings
const ListIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 5h2v2H3V5zm0 4h2v2H3V9zm0 4h2v2H3v-2zm4-8h10v2H7V5zm0 4h10v2H7V9zm0 4h10v2H7v-2z" />
  </svg>
);
const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
  </svg>
);
const MenuIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 6h16v2H2V6zm0 4h16v2H2v-2zm0 4h16v2H2v-2z" />
  </svg>
);

const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false); // collapsed by default

  useEffect(() => {
    // update CSS variable used by layout to adjust main content margin
    const width = expanded ? "16rem" : "4rem";
    document.documentElement.style.setProperty("--sidebar-w", width);
  }, [expanded]);

  const isActive = (path) => location.pathname === path;

  const links = [
    { path: "/", label: "Home", Icon: HomeIcon },
    { path: "/parking", label: "Parking Lots", Icon: ParkingIcon },
    { path: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
    { path: "/bookings", label: "My Bookings", Icon: ListIcon },
    { path: "/bookings/new", label: "New Booking", Icon: PlusIcon },
  ];

  // when not authenticated, remove Dashboard and New Booking
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleLinks = isAuthenticated
    ? links
    : links.filter((l) => ["/", "/parking"].includes(l.path));

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-clip-border z-40 transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
      style={{
        width: expanded ? "16rem" : "4rem",
        background: "linear-gradient(180deg,#1e293b,#0f172a)",
        borderRight: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-700">
        <button
          aria-label={expanded ? "Collapse menu" : "Expand menu"}
          aria-expanded={expanded}
          onClick={() => setExpanded((s) => !s)}
          className="p-2 rounded-md text-gray-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <MenuIcon />
        </button>
        <div
          className={`ml-2 text-sm font-semibold text-gray-200 transition-opacity duration-200 ${
            expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          Menu
        </div>
      </div>

      <nav className="flex-1 px-1 py-4 space-y-1">
        {visibleLinks.map((link) => {
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-2 py-2 rounded-md mx-2 transition-colors duration-150 ease-in-out ${
                active ? "bg-clip-border" : "text-gray-300 hover:bg-slate-700"
              }`}
              style={
                active
                  ? {
                      background:
                        "linear-gradient(90deg, rgba(99,102,241,0.12), rgba(79,70,229,0.06))",
                      color: "var(--accent)",
                    }
                  : {}
              }
            >
              <span
                className={`flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-md ${
                  active ? "bg-clip-border" : ""
                }`}
              >
                <link.Icon className="w-5 h-5 text-current" />
              </span>
              <span
                className={`ml-3 text-sm font-medium transition-all duration-200 ${
                  expanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 w-0 overflow-hidden text-gray-200"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer spacer to keep layout balanced */}
      <div className="p-3 border-t border-gray-700 flex items-center justify-between">
        <div
          className={`text-xs text-muted transition-opacity duration-200 ${
            expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          Smart Parking
        </div>
        <div className="ml-auto">
          <button onClick={handleLogout} className="btn-ghost" title="Logout">
            <svg
              className="w-4 h-4 mr-2 inline-block"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 17l5-5-5-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 19H6a2 2 0 01-2-2V7a2 2 0 012-2h7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className={`text-sm font-medium ${
                expanded ? "inline" : "hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
