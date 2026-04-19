'use client';
import { useState } from 'react';

interface EcoAction {
  action: string;
  annualSavingKg: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface EcoAnalysis {
  annualCO2Kg: number;
  sustainabilityScore: number;
  summary: string;
  topActions: EcoAction[];
}

const EXAMPLES = [
  'I drive 30km to work daily in Turku, eat meat most days, live in a 70sqm apartment with district heating, and fly twice a year for holidays',
  'I cycle to work, eat plant-based most of the week, live in Helsinki and use public transport, rarely fly, and buy mostly second-hand clothes',
  'I work from home in Tampere, have a small electric car, eat meat 3-4 times a week, heat my house with a ground-source heat pump, and travel by train within Finland',
];

export default function Home() {
  const [lifestyle, setLifestyle] = useState('');
  const [region, setRegion] = useState('Finland');
  const [analysis, setAnalysis] = useState<EcoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!lifestyle.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: lifestyle, region }),
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const difficultyColor = (diff: string) => {
    if (diff === 'easy') return 'text-green-400';
    if (diff === 'medium') return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen gradient-bg px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
            🌍 EcoMind
          </h1>
          <p className="text-xl text-green-200/80 max-w-2xl mx-auto">
            AI-powered carbon footprint analysis using Google Gemini
          </p>
        </div>

        {/* Input Card */}
        <div className="glass-card glow-green p-8 mb-8">
          <label className="block text-lg font-semibold mb-3 text-green-300">
            Describe Your Lifestyle
          </label>
          <textarea
            className="w-full h-32 bg-black/40 border border-green-500/30 rounded-lg px-4 py-3 text-white placeholder-green-700 focus:border-green-500 resize-none"
            placeholder="e.g., I drive to work every day, eat meat 5 times a week..."
            value={lifestyle}
            onChange={(e) => setLifestyle(e.target.value)}
          />
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-green-400">Your Region</label>
            <input
              type="text"
              className="w-full bg-black/40 border border-green-500/30 rounded-lg px-4 py-2 text-white"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <p className="text-sm text-green-400 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setLifestyle(ex)}
                  className="px-3 py-1.5 bg-green-900/30 border border-green-600/40 rounded-lg text-sm text-green-300 hover:bg-green-800/40 transition"
                >
                  Example {i + 1}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!lifestyle.trim() || loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? '🔄 Analyzing...' : '✨ Analyze My Footprint'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8 text-red-300">
            ⚠️ {error}
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-6 fade-in-up">
            {/* Score Card */}
            <div className="glass-card glow-green p-8 text-center">
              <div className="flex justify-center items-center gap-8">
                <div>
                  <p className="text-green-400 text-sm mb-1">Annual CO₂</p>
                  <p className="text-5xl font-bold text-white">{analysis.annualCO2Kg.toLocaleString()}</p>
                  <p className="text-green-300 text-sm mt-1">kg/year</p>
                </div>
                <div className="score-ring border-4 border-green-500">
                  <p className="text-4xl font-bold text-green-400">{analysis.sustainabilityScore}</p>
                  <p className="text-xs text-green-500">/ 10</p>
                </div>
              </div>
              <p className="mt-6 text-green-200/90 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Actions */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-green-300">🎯 Top Actions</h2>
              <div className="space-y-4">
                {analysis.topActions.map((action, idx) => (
                  <div key={idx} className="bg-black/30 border border-green-600/20 rounded-lg p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white text-lg">{action.action}</h3>
                      <span className={`text-sm px-3 py-1 rounded-full ${difficultyColor(action.difficulty)} bg-black/40`}>
                        {action.difficulty}
                      </span>
                    </div>
                    <p className="text-green-400 text-sm mb-1">💾 Save ~{action.annualSavingKg} kg CO₂/year</p>
                    <p className="text-green-500/70 text-xs">{action.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-green-600/60 text-sm">
          <p>Powered by Google Gemini • Built for DEV Weekend Challenge: Earth Day Edition</p>
        </div>
      </div>
    </div>
  );
}
