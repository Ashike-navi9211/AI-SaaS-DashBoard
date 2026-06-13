import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Wand2, History, BarChart2, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tools', label: 'AI Tools', icon: Wand2 },
  { to: '/history', label: 'History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col p-6">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-white">AI SaaS</h1>
        <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              location.pathname === to
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
