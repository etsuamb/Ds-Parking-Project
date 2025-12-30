import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const publicLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/parking', label: 'Parking Lots', icon: '🅿️' },
  ];

  const protectedLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/bookings', label: 'My Bookings', icon: '📅' },
    { path: '/bookings/new', label: 'New Booking', icon: '➕' },
  ];

  const links = isAuthenticated ? [...publicLinks, ...protectedLinks] : publicLinks;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      <div className="h-full overflow-y-auto">
        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'bg-primary-100 text-primary-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

