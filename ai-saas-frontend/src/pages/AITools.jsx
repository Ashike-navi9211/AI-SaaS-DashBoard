import { useState } from 'react';
import Navbar from '../components/Navbar';
import { callAI } from '../api/ai.api';
import toast from 'react-hot-toast';
import { Wand2, FileText, Code } from 'lucide-react';

const tools = [
  { id: 'generate', label: 'Generate Text', icon: Wand2, placeholder: 'Write a blog post about AI trends in 2025...' },
  { id: 'summarize', label: 'Summarize', icon: FileText, placeholder: 'Paste any long text here to summarize...' },
  { id: 'explain', label: 'Explain Code', icon: Code, placeholder: 'Paste your code here to get an explanation...' },
];

export default function AITools() {
  const [activeTool, setActiveTool] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return toast.error('Please enter a prompt');
    setLoading(true);
    setResponse('');
    try {
      const res = await callAI({ prompt, tool: activeTool });
      setResponse(res.data.data.response);
      setTokensUsed(res.data.data.tokensUsed);
      toast.success(`Done! ${res.data.data.tokensUsed} tokens used`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const activePlaceholder = tools.find((t) => t.id === activeTool)?.placeholder;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold text-white mb-1">AI Tools</h2>
        <p className="text-gray-400 mb-8">Choose a tool and enter your prompt.</p>

        <div className="flex gap-3 mb-6">
          {tools.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTool(id); setResponse(''); setPrompt(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTool === id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <label className="text-sm text-gray-400 mb-3 block">Your Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={activePlaceholder}
              rows={10}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-400">Response</label>
              {tokensUsed && <span className="text-xs text-gray-500">{tokensUsed} tokens</span>}
            </div>
            {loading ? (
              <div className="flex items-center justify-center h-48 text-gray-500">Generating response...</div>
            ) : response ? (
              <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{response}</div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-600 text-sm">Response will appear here</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
