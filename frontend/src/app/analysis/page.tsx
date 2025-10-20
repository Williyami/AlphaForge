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
        {/* Header with Export Button */}
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
            {/* Header */}
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
            </div>

            {/* Scenario Comparison Chart */}
            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Scenario Comparison
              </h3>
              <ScenarioComparisonChart scenarios={scenarios.scenarios} currentPrice={scenarios.current_price} />
            </div>
          </div>
        )}

        {/* Regular Analysis Results */}
        {!showScenarios && results && (
          <div className="space-y-6">
            {/* Summary Cards */}
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

            {/* Investment Recommendation - MOVED HERE */}
            <div className={`rounded-lg p-6 border-2 ${
              results.upside > 20 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600' 
                : results.upside > 0 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
                : 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  results.upside > 20 
                    ? 'bg-green-500' 
                    : results.upside > 0 
                    ? 'bg-blue-500'
                    : 'bg-red-500'
                }`}>
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {results.upside > 20 ? 'Strong Buy 🚀' : results.upside > 0 ? 'Buy 👍' : 'Hold/Sell ⚠️'}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">
                    {results.ticker} is trading at <span className="font-semibold">${results.current_price.toFixed(2)}</span>, 
                    {results.upside > 0 ? ' below' : ' above'} our fair value estimate of <span className="font-semibold">${results.dcf_results.value_per_share.toFixed(2)}</span>, suggesting <span className="font-bold">{Math.abs(results.upside).toFixed(1)}% 
                    {results.upside > 0 ? ' upside' : ' downside'}</span> potential.
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue & EBITDA Growth */}
              <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Revenue & EBITDA Projection
                </h3>
                <RevenueGrowthChart data={results.dcf_results.projections} />
              </div>

              {/* FCF Waterfall */}
              <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Free Cash Flow (5 Years)
                </h3>
                <FCFWaterfallChart data={results.dcf_results.projections} />
              </div>
            </div>

            {/* Valuation Breakdown - IMPROVED */}
            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <DollarSign className="h-5 w-5 text-purple-500" />
                Enterprise Value Breakdown
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side - Chart */}
                <div>
                  <ValuationBreakdownChart 
                    pvFCF={results.dcf_results.pv_fcf} 
                    pvTerminal={results.dcf_results.pv_terminal} 
                  />
                </div>

                {/* Right side - Explanation */}
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Present Value of FCF</p>
                      <p className="text-2xl font-bold text-blue-600">${(results.dcf_results.pv_fcf / 1e9).toFixed(2)}B</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Value from cash flows over next 10 years
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Terminal Value</p>
                      <p className="text-2xl font-bold text-purple-600">${(results.dcf_results.pv_terminal / 1e9).toFixed(2)}B</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Value beyond year 10 (perpetuity)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg border-2 border-gray-300 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Enterprise Value</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${(results.dcf_results.enterprise_value / 1e9).toFixed(2)}B
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DCF Summary */}
            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Full Valuation Summary
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Value Per Share</p>
                  <p className="font-semibold text-xl text-blue-600">
                    ${results.dcf_results.value_per_share.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Projections Table */}
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
      </div>
    </div>
  );
}