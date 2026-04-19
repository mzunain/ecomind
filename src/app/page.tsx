'use client';

import { useState } from 'react';

interface EcoAction {
  action: string;
  annualSavingKg: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  reasoning: string;
}

interface EcoAnalysis {
  annualCO2Kg: number;
  sustainabilityScore: number;
  summary: string;
  topActions: EcoAction[];
  regionalContext: string;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

const EXAMPLE_INPUTS = [
  'I drive a petrol car 30km daily to work in Turku, eat meat most days, live in a 70sqm apartment heated by district heating, and fly twice a year for holidays.',
  'I cycle to work, eat plant-based most of the week, live in Helsinki and use public transport, rarely fly, and buy mostly second-hand clothes.',
  'I work from home in Tampere, have a small electric car, eat meat 3-4 times a week, heat my house with a ground-source heat pump, and travel by train within Finland.',
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
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lifestyle, region }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data: EcoAnalysis = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🌍</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EcoMind</h1>
          <p className="text-lg text-gray-600">
            Describe your lifestyle. Get a personalised carbon footprint analysis powered by Google Gemini.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Describe your daily lifestyle
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-xl p-4 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[140px]"
            placeholder="e.g. I drive to work every day, eat meat 5 times a week, fly for holidays twice a year..."
            value={lifestyle}
            onChange={(e) => setLifestyle(e.target.value)}
          />

          <div className="flex items-center gap-3 mt-3">
            <label className="text-sm font-medium text-gray-600">Your region:</label>
            <input
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Finland"
            />
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_INPUTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setLifestyle(ex)}
                  className="text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-lg px-3 py-1.5 transition-colors"
                >
                  Example {i + 1}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!lifestyle.trim() || loading}
            className="mt-5 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="animate-spin">⟳</span> Analyzing with Gemini...</>
            ) : (
              '🔍 Analyze My Footprint'
            )}
          </button>

          {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
        </div>

        {/* Results */}
        {analysis && (
          <div className="space-y-5">
            {/* Score + CO2 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {analysis.annualCO2Kg.toLocaleString()} kg
                </div>
                <div className="text-sm text-gray-500 mt-1">Estimated Annual CO₂</div>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6 text-center">
                <div className={`text-3xl font-bold ${scoreColor(analysis.sustainabilityScore)}`}>
                  {analysis.sustainabilityScore}/10
                </div>
                <div className="text-sm text-gray-500 mt-1">Sustainability Score</div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="font-semibold text-gray-800 mb-2">📋 Summary</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Regional Context */}
            <div className="bg-emerald-50 rounded-2xl shadow-md p-6">
              <h2 className="font-semibold text-gray-800 mb-2">📍 Regional Context</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{analysis.regionalContext}</p>
            </div>

            {/* Top Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="font-semibold text-gray-800 mb-4">⚡ Top Actions to Reduce Your Footprint</h2>
              <div className="space-y-4">
                {analysis.topActions.map((action, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800 text-sm">{i + 1}. {action.action}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{action.reasoning}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-0.5">{action.category}</span>
                          <span className={`text-xs rounded px-2 py-0.5 ${difficultyColors[action.difficulty]}`}>
                            {action.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-green-600 font-bold text-sm">-{action.annualSavingKg} kg</div>
                        <div className="text-xs text-gray-400">CO₂/year</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          Powered by Google Gemini · Built for the DEV Weekend Challenge: Earth Day Edition
        </p>
      </div>
    </main>
  );
}
