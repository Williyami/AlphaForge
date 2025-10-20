"use client";

import { useState } from 'react';
import { Search, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export default function Analysis() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalysis = async () => {
    if (!ticker.trim()) {
      setError('Please enter a ticker symbol');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/v1/analysis/quick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: ticker.toUpperCase() })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Stock Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate DCF valuations and fundamental analysis</p>
        </header>

        <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Enter Ticker Symbol</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalysis()}
              placeholder="e.g., AAPL, MSFT, GOOGL"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={handleAnalysis}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 rounded-lg font-semibold flex items-center gap-2 transition text-white"
            >
              <Search className="h-5 w-5" />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{results.company_name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Ticker</p>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">{results.ticker}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Current Price</p>
                  <p className="font-semibold text-lg text-gray-900 dark:text-white">${results.current_price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Fair Value</p>
                  <p className="font-semibold text-lg text-blue-500">
                    ${results.dcf_results.value_per_share.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Upside</p>
                  <p className={`font-semibold text-lg ${results.upside > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {results.upside > 0 ? '+' : ''}{results.upside.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <DollarSign className="h-5 w-5 text-blue-500" />
                DCF Valuation Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-[#0D1117] p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Enterprise Value</p>
                  <p className="font-semibold text-xl text-gray-900 dark:text-white">
                    ${(results.dcf_results.enterprise_value / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#0D1117] p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Equity Value</p>
                  <p className="font-semibold text-xl text-gray-900 dark:text-white">
                    ${(results.dcf_results.equity_value / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-[#0D1117] p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">PV of FCF</p>
                  <p className="font-semibold text-xl text-gray-900 dark:text-white">
                    ${(results.dcf_results.pv_fcf / 1e9).toFixed(2)}B
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <Calendar className="h-5 w-5 text-blue-500" />
                10-Year Projections
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700">
                      <th className="text-left py-2 text-gray-900 dark:text-white">Year</th>
                      <th className="text-right py-2 text-gray-900 dark:text-white">Revenue</th>
                      <th className="text-right py-2 text-gray-900 dark:text-white">EBITDA</th>
                      <th className="text-right py-2 text-gray-900 dark:text-white">FCF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.dcf_results.projections.slice(0, 5).map((proj: any) => (
                      <tr key={proj.Year} className="border-b border-gray-200 dark:border-gray-800">
                        <td className="py-2 text-gray-900 dark:text-white">{proj.Year}</td>
                        <td className="text-right text-gray-900 dark:text-white">${(proj.Revenue / 1e9).toFixed(2)}B</td>
                        <td className="text-right text-gray-900 dark:text-white">${(proj.EBITDA / 1e9).toFixed(2)}B</td>
                        <td className="text-right text-gray-900 dark:text-white">${(proj.FCF / 1e9).toFixed(2)}B</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`rounded-lg p-6 border ${
              results.upside > 20 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                : results.upside > 0 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
            }`}>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {results.upside > 20 ? 'Strong Buy' : results.upside > 0 ? 'Buy' : 'Hold/Sell'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Based on DCF analysis, {results.ticker} is trading at ${results.current_price.toFixed(2)}, 
                {results.upside > 0 ? ' below' : ' above'} our fair value estimate of $
                {results.dcf_results.value_per_share.toFixed(2)}, suggesting {Math.abs(results.upside).toFixed(1)}% 
                {results.upside > 0 ? ' upside' : ' downside'} potential.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
