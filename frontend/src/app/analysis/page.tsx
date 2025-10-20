"use client";

import { useState } from 'react';
import { Search, DollarSign, Calendar, Zap, TrendingUp, BarChart3, Download, Save, CheckCircle } from 'lucide-react';
import { BearIcon, BaseIcon, BullIcon } from '@/components/Icons';
import { RevenueGrowthChart, FCFWaterfallChart, ScenarioComparisonChart, ValuationBreakdownChart } from '@/components/Charts';
import { exportDCFToExcel, exportScenariosToExcel } from '@/lib/exportToExcel';

export default function Analysis() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any>(null);
  const [error, setError] = useState('');
  const [showScenarios, setShowScenarios] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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

  const handleExport = () => {
    if (showScenarios && scenarios) {
      exportScenariosToExcel(scenarios);
    } else if (results) {
      exportDCFToExcel(results);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const dataToSave = showScenarios ? {
        ticker: scenarios.ticker,
        company_name: scenarios.company_name,
        current_price: scenarios.current_price,
        fair_value: scenarios.scenarios.base.value_per_share,
        upside_percent: scenarios.scenarios.base.upside,
        enterprise_value: scenarios.base_case.enterprise_value,
        equity_value: scenarios.base_case.equity_value,
        dcf_results: scenarios
      } : {
        ticker: results.ticker,
        company_name: results.company_name,
        current_price: results.current_price,
        fair_value: results.dcf_results.value_per_share,
        upside_percent: results.upside,
        enterprise_value: results.dcf_results.enterprise_value,
        equity_value: results.dcf_results.equity_value,
        dcf_results: results.dcf_results
      };
      
      const response = await fetch(`${API_URL}/api/v1/saved/dcf/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
      
      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving analysis:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const displayData = showScenarios ? scenarios : results;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Stock Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400">Generate DCF valuations and scenario analysis</p>
          </div>
          {displayData && (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg hover:shadow-xl ${
                  saveStatus === 'saved'
                    ? 'bg-green-600 text-white'
                    : saveStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Saved!
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <Save className="h-5 w-5" />
                    Failed
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Analysis
                  </>
                )}
              </button>
              <button
                onClick={handleExport}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition shadow-lg hover:shadow-xl"
              >
                <Download className="h-5 w-5" />
                Export to Excel
              </button>
            </div>
          )}
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
              {loading ? 'Analyzing...' : 'Quick DCF'}
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

        {/* Results Section */}
        {displayData && (
          <div className="space-y-6">
            {/* Company Header */}
            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {displayData.company_name} ({displayData.ticker})
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Current Price: <span className="font-semibold text-gray-900 dark:text-white">
                  ${displayData.current_price?.toFixed(2) || '0.00'}
                </span>
              </p>
            </div>

            {/* Scenario or Regular Results */}
            {showScenarios && scenarios ? (
              <>
                {/* Scenario Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Bear */}
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BearIcon className="w-8 h-8" />
                      <div>
                        <h3 className="text-lg font-bold">Bear Case</h3>
                        <span className="text-xs text-red-600">Pessimistic</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fair Value</p>
                      <p className="text-2xl font-bold">${scenarios.scenarios.bear.value_per_share.toFixed(2)}</p>
                      <p className={`text-xl font-semibold mt-2 ${scenarios.scenarios.bear.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarios.scenarios.bear.upside > 0 ? '+' : ''}{scenarios.scenarios.bear.upside.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Base */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-600 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BaseIcon className="w-8 h-8" />
                      <div>
                        <h3 className="text-lg font-bold">Base Case</h3>
                        <span className="text-xs text-blue-600">Most Likely</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fair Value</p>
                      <p className="text-2xl font-bold">${scenarios.scenarios.base.value_per_share.toFixed(2)}</p>
                      <p className={`text-xl font-semibold mt-2 ${scenarios.scenarios.base.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarios.scenarios.base.upside > 0 ? '+' : ''}{scenarios.scenarios.base.upside.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Bull */}
                  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <BullIcon className="w-8 h-8" />
                      <div>
                        <h3 className="text-lg font-bold">Bull Case</h3>
                        <span className="text-xs text-green-600">Optimistic</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fair Value</p>
                      <p className="text-2xl font-bold">${scenarios.scenarios.bull.value_per_share.toFixed(2)}</p>
                      <p className={`text-xl font-semibold mt-2 ${scenarios.scenarios.bull.upside > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {scenarios.scenarios.bull.upside > 0 ? '+' : ''}{scenarios.scenarios.bull.upside.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scenario Chart */}
                <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold mb-4">Scenario Comparison</h3>
                  <ScenarioComparisonChart data={scenarios.scenarios} currentPrice={scenarios.current_price} />
                </div>
              </>
            ) : results && (
              <>
                {/* Regular DCF Summary */}
                <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Ticker</p>
                      <p className="font-semibold text-lg">{results.ticker}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Current Price</p>
                      <p className="font-semibold text-lg">${results.current_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Fair Value</p>
                      <p className="font-semibold text-lg text-blue-500">${results.dcf_results.value_per_share.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Upside</p>
                      <p className={`font-semibold text-lg ${results.upside > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {results.upside > 0 ? '+' : ''}{results.upside.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Revenue & EBITDA
                    </h3>
                    <RevenueGrowthChart data={results.dcf_results.projections} />
                  </div>

                  <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-500" />
                      Free Cash Flow
                    </h3>
                    <FCFWaterfallChart data={results.dcf_results.projections} />
                  </div>
                </div>

                {/* Valuation Breakdown */}
                <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-500" />
                    Enterprise Value Breakdown
                  </h3>
                  <ValuationBreakdownChart pvFCF={results.dcf_results.pv_fcf} pvTerminal={results.dcf_results.pv_terminal} />
                </div>

                {/* Projections Table */}
                <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    10-Year Financial Projections
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                          <th className="text-left py-3 px-2 font-semibold">Year</th>
                          <th className="text-right py-3 px-2 font-semibold">Revenue</th>
                          <th className="text-right py-3 px-2 font-semibold">EBITDA</th>
                          <th className="text-right py-3 px-2 font-semibold">EBIT</th>
                          <th className="text-right py-3 px-2 font-semibold">NOPAT</th>
                          <th className="text-right py-3 px-2 font-semibold">FCF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.dcf_results.projections.map((proj: any) => (
                          <tr key={proj.Year} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                            <td className="py-3 px-2 font-medium">{proj.Year}</td>
                            <td className="text-right py-3 px-2">${(proj.Revenue / 1e9).toFixed(2)}B</td>
                            <td className="text-right py-3 px-2">${(proj.EBITDA / 1e9).toFixed(2)}B</td>
                            <td className="text-right py-3 px-2">${(proj.EBIT / 1e9).toFixed(2)}B</td>
                            <td className="text-right py-3 px-2">${(proj.NOPAT / 1e9).toFixed(2)}B</td>
                            <td className="text-right py-3 px-2 text-green-600 dark:text-green-400 font-semibold">${(proj.FCF / 1e9).toFixed(2)}B</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}