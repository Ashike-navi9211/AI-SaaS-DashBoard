import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getWeeklyUsage } from '../api/usage.api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getWeeklyUsage()
      .then((res) => setData(res.data.data.weekly))
      .catch(() => {});
  }, []);

  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
  }));

  const totalTokens = data.reduce((sum, d) => sum + d.tokensUsed, 0);
  const totalRequests = data.reduce((sum, d) => sum + d.requestCount, 0);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-white mb-1">Analytics</h2>
        <p className="text-gray-400 mb-8">Your usage over the last 7 days.</p>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Total Tokens (7 days)</p>
            <p className="text-3xl font-bold text-white">{totalTokens.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Total Requests (7 days)</p>
            <p className="text-3xl font-bold text-white">{totalRequests}</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
          <h3 className="text-white font-semibold mb-6">Tokens Used Per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="tokensUsed" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Tokens" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-6">Requests Per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="requestCount" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
