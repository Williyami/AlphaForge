"use client";

import { useState } from 'react';
import { Search, DollarSign, Calendar, Zap } from 'lucide-react';
import { BearIcon, BaseIcon, BullIcon } from '@/components/Icons';

export default function Analysis() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any>(null);
  const [error, setError] = useState('');
  const [showScenarios, setShowScenarios] = useState(false);

  const handleAnalysis = async (includeScenarios = false) => {
    if (!ticker.trim()) {
      setError('Please enter a ticker symbol');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setScenarios(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      if (includeScenarios) {
        const response = await fetch(`${API_URL}/api/v1/analysis/scenarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker: ticker.toUpperCase() })
        });

        if (!response.ok) throw new Error('Failed to fetch scenarios');
        
        const data = await response.json();
        setScenarios(data);
        setShowScenarios(true);
      } else {
        const response = await fetch(`${API_URL}/api/v1/analysis/quick`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker: ticker.toUpperCase() })
        });

        if (!response.ok) throw new Error('Failed to fetch analysis');
        
        const data = await response.json();
        setResults(data);
        setShowScenarios(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const displayData = showScenarios ? scenarios : results;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Stock Analysis</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate DCF valuations and scenario analysis</p>
        </header>

        {/* Search Bar */}
        <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Enter Ticker Symbol</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalysis(false)}
              placeholder="e.g., AAPL, MSFT, GOOGL"
              className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white placeholder-gray-500"
            />
            <button
              onClick={() => handleAnalysis(false)}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg font-semibold flex items-center gap-2 transition text-white"
            >
              <Search className="h-5 w-5" />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <button
              onClick={() => handleAnalysis(true)}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 rounded-lg font-semibold flex items-center gap-2 transition text-white"
            >
              <Zap className="h-5 w-5" />
              Scenarios
            </button>
          </div>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>

        {/* Scenario Analysis Results */}
        {showScenarios && scenarios && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{scenarios.company_name}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Current Price: <span className="font-semibold text-gray-900 dark:text-white">${scenarios.current_price.toFixed(2)}</span>
              </p>

              {/* Scenario Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bear Case */}
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BearIcon className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bear Case</h3>
                      <span className="text-xs text-red-600 dark:text-red-400">Pessimistic</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fair Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${scenarios.scenarios.bear.value_per_share.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upside/Downside</p>
                      <p className={`text-xl font-semibold ${scenarios.scenarios.bear.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarios.scenarios.bear.upside > 0 ? '+' : ''}{scenarios.scenarios.bear.upside}%
                      </p>
                    </div>
                    <div className="pt-3 border-t border-red-200 dark:border-red-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Assumptions:</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Growth: {(scenarios.scenarios.bear.assumptions.revenue_growth * 100).toFixed(1)}%<br/>
                        Margin: {(scenarios.scenarios.bear.assumptions.ebitda_margin * 100).toFixed(1)}%<br/>
                        WACC: {(scenarios.scenarios.bear.assumptions.wacc * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Base Case */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BaseIcon className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Base Case</h3>
                      <span className="text-xs text-blue-600 dark:text-blue-400">Most Likely</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fair Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${scenarios.scenarios.base.value_per_share.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upside/Downside</p>
                      <p className={`text-xl font-semibold ${scenarios.scenarios.base.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarios.scenarios.base.upside > 0 ? '+' : ''}{scenarios.scenarios.base.upside}%
                      </p>
                    </div>
                    <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Assumptions:</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Growth: {(scenarios.scenarios.base.assumptions.revenue_growth * 100).toFixed(1)}%<br/>
                        Margin: {(scenarios.scenarios.base.assumptions.ebitda_margin * 100).toFixed(1)}%<br/>
                        WACC: {(scenarios.scenarios.base.assumptions.wacc * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bull Case */}
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BullIcon className="w-8 h-8" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bull Case</h3>
                      <span className="text-xs text-green-600 dark:text-green-400">Optimistic</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fair Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${scenarios.scenarios.bull.value_per_share.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upside/Downside</p>
                      <p className={`text-xl font-semibold ${scenarios.scenarios.bull.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarios.scenarios.bull.upside > 0 ? '+' : ''}{scenarios.scenarios.bull.upside}%
                      </p>
                    </div>
                    <div className="pt-3 border-t border-green-200 dark:border-green-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Assumptions:</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Growth: {(scenarios.scenarios.bull.assumptions.revenue_growth * 100).toFixed(1)}%<br/>
                        Margin: {(scenarios.scenarios.bull.assumptions.ebitda_margin * 100).toFixed(1)}%<br/>
                        WACC: {(scenarios.scenarios.bull.assumptions.wacc * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Valuation Range */}
              <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Valuation Range</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative h-8 bg-gradient-to-r from-red-200 via-blue-200 to-green-200 dark:from-red-900 dark:via-blue-900 dark:to-green-900 rounded-lg overflow-hidden">
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-black dark:bg-white"
                        style={{
                          left: `${((scenarios.current_price - scenarios.scenarios.bear.value_per_share) / 
                                  (scenarios.scenarios.bull.value_per_share - scenarios.scenarios.bear.value_per_share)) * 100}%`
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap text-gray-900 dark:text-white font-semibold">
                          Current
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>${scenarios.scenarios.bear.value_per_share.toFixed(0)}</span>
                      <span>${scenarios.scenarios.base.value_per_share.toFixed(0)}</span>
                      <span>${scenarios.scenarios.bull.value_per_share.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Analysis Results */}
        {!showScenarios && results && (
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

            {/* DCF Summary */}
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
          </div>
        )}

        {/* Financial Projections Table - Shows for BOTH scenarios and regular analysis */}
        {displayData && (
          <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="h-5 w-5 text-blue-500" />
              10-Year Financial Projections
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                    <th className="text-left py-3 px-2 text-gray-900 dark:text-white font-semibold">Year</th>
                    <th className="text-right py-3 px-2 text-gray-900 dark:text-white font-semibold">Revenue</th>
                    <th className="text-right py-3 px-2 text-gray-900 dark:text-white font-semibold">EBITDA</th>
                    <th className="text-right py-3 px-2 text-gray-900 dark:text-white font-semibold">EBIT</th>
                    <th className="text-right py-3 px-2 text-gray-900 dark:text-white font-semibold">NOPAT</th>
                    <th className="text-right py-3 px-2 text-gray-900 dark:text-white font-semibold">FCF</th>
                  </tr>
                </thead>
                <tbody>
                  {(showScenarios ? scenarios.base_case.projections : results.dcf_results.projections).map((proj: any) => (
                    <tr key={proj.Year} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="py-3 px-2 text-gray-900 dark:text-white font-medium">{proj.Year}</td>
                      <td className="text-right py-3 px-2 text-gray-900 dark:text-white">${(proj.Revenue / 1e9).toFixed(2)}B</td>
                      <td className="text-right py-3 px-2 text-gray-900 dark:text-white">${(proj.EBITDA / 1e9).toFixed(2)}B</td>
                      <td className="text-right py-3 px-2 text-gray-900 dark:text-white">${(proj.EBIT / 1e9).toFixed(2)}B</td>
                      <td className="text-right py-3 px-2 text-gray-900 dark:text-white">${(proj.NOPAT / 1e9).toFixed(2)}B</td>
                      <td className="text-right py-3 px-2 text-green-600 dark:text-green-400 font-semibold">${(proj.FCF / 1e9).toFixed(2)}B</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Investment Recommendation - Shows for regular analysis only */}
        {!showScenarios && results && (
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
        )}
      </div>
    </div>
  );
}
