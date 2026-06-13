import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getHistory } from '../api/usage.api';
import { Wand2, FileText, Code } from 'lucide-react';

const toolIcons = { generate: Wand2, summarize: FileText, explain: Code };
const toolColors = { generate: 'bg-blue-600', summarize: 'bg-purple-600', explain: 'bg-green-600' };

export default function History() {
  const [prompts, setPrompts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHistory(page)
      .then((res) => {
        setPrompts(res.data.data.prompts);
        setPagination(res.data.data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-white mb-1">Prompt History</h2>
        <p className="text-gray-400 mb-8">All your previous AI interactions.</p>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : prompts.length === 0 ? (
          <div className="text-gray-500">No prompts yet. Try the AI Tools!</div>
        ) : (
          <div className="space-y-4">
            {prompts.map((p) => {
              const Icon = toolIcons[p.tool] || Wand2;
              const color = toolColors[p.tool] || 'bg-blue-600';
              return (
                <div key={p._id} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${color} p-2 rounded-lg`}><Icon size={16} className="text-white" /></div>
                    <span className="text-xs text-gray-500 capitalize">{p.tool}</span>
                    <span className="text-xs text-gray-600 ml-auto">{new Date(p.createdAt).toLocaleString()}</span>
                    <span className="text-xs text-gray-600">{p.tokensUsed} tokens</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3 font-medium">{p.prompt}</p>
                  <p className="text-gray-500 text-sm line-clamp-3">{p.response}</p>
                </div>
              );
            })}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-gray-500 text-sm py-2">Page {page} of {pagination.pages}</span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
