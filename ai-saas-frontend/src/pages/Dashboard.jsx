import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getTodayUsage } from '../api/usage.api';
import { Zap, MessageSquare, BarChart2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    getTodayUsage()
      .then((res) => setUsage(res.data.data))
      .catch(() => {});
  }, []);

  const percent = usage ? Math.round((usage.tokensUsed / usage.dailyLimit) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.name} 👋
        </h2>
        <p className="text-gray-400 mb-8">Here's your usage summary for today.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg"><Zap size={20} className="text-white" /></div>
              <span className="text-gray-400 text-sm">Tokens Used Today</span>
            </div>
            <p className="text-3xl font-bold text-white">{usage?.tokensUsed ?? 0}</p>
            <p className="text-gray-500 text-xs mt-1">of {usage?.dailyLimit ?? 10000} limit</p>
            <div className="mt-4 bg-gray-800 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 p-2 rounded-lg"><MessageSquare size={20} className="text-white" /></div>
              <span className="text-gray-400 text-sm">Requests Today</span>
            </div>
            <p className="text-3xl font-bold text-white">{usage?.requestCount ?? 0}</p>
            <p className="text-gray-500 text-xs mt-1">API calls made</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-600 p-2 rounded-lg"><BarChart2 size={20} className="text-white" /></div>
              <span className="text-gray-400 text-sm">Plan</span>
            </div>
            <p className="text-3xl font-bold text-white capitalize">{user?.plan ?? 'free'}</p>
            <p className="text-gray-500 text-xs mt-1">Current plan</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { to: '/tools', label: 'Generate Text', desc: 'Create content with AI' },
              { to: '/tools', label: 'Summarize', desc: 'Summarize any text' },
              { to: '/tools', label: 'Explain Code', desc: 'Understand any code' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 rounded-xl p-4 transition group"
              >
                <div>
                  <p className="text-white text-sm font-medium">{action.label}</p>
                  <p className="text-gray-500 text-xs mt-1">{action.desc}</p>
                </div>
                <ArrowRight size={16} className="text-gray-500 group-hover:text-white transition" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
