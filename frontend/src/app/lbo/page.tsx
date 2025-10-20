"use client";

import { useState } from 'react';
import { Search, DollarSign, TrendingUp, Percent, Download } from 'lucide-react';

export default function LBO() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  
  // LBO Parameters
  const [purchaseMultiple, setPurchaseMultiple] = useState(10);
  const [exitMultiple, setExitMultiple] = useState(10);
  const [debtPercent, setDebtPercent] = useState(60);
  const [interestRate, setInterestRate] = useState(6);
  const [holdPeriod, setHoldPeriod] = useState(5);

  const handleCalculate = async () => {
    if (!ticker.trim()) {
      setError('Please enter a ticker symbol');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/v1/lbo/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: ticker.toUpperCase(),
          purchase_multiple: purchaseMultiple,
          exit_multiple: exitMultiple,
          debt_percent: debtPercent / 100,
          interest_rate: interestRate / 100,
          hold_period: holdPeriod
        })
      });

      if (!response.ok) throw new Error('Failed to calculate LBO');
      
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
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">LBO Model</h1>
          <p className="text-gray-600 dark:text-gray-400">Leveraged Buyout Analysis & Returns Calculator</p>
        </header>

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Company Input */}
          <div className="lg:col-span-3 bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Company Ticker</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                placeholder="e.g., AAPL, MSFT, GOOGL"
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-[#0D1117] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white placeholder-gray-500"
              />
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg font-semibold flex items-center gap-2 transition text-white"
              >
                <Search className="h-5 w-5" />
                {loading ? 'Calculating...' : 'Calculate'}
              </button>
            </div>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>

          {/* Transaction Parameters */}
          <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Purchase Multiple (EV/EBITDA)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="6"
                    max="15"
                    step="0.5"
                    value={purchaseMultiple}
                    onChange={(e) => setPurchaseMultiple(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold w-12 text-gray-900 dark:text-white">{purchaseMultiple}x</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Exit Multiple (EV/EBITDA)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="6"
                    max="15"
                    step="0.5"
                    value={exitMultiple}
                    onChange={(e) => setExitMultiple(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold w-12 text-gray-900 dark:text-white">{exitMultiple}x</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Hold Period (Years)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="3"
                    max="7"
                    step="1"
                    value={holdPeriod}
                    onChange={(e) => setHoldPeriod(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold w-12 text-gray-900 dark:text-white">{holdPeriod} yrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financing Structure */}
          <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Financing Structure</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Debt %
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="40"
                    max="80"
                    step="5"
                    value={debtPercent}
                    onChange={(e) => setDebtPercent(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold w-12 text-gray-900 dark:text-white">{debtPercent}%</span>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Equity: {100 - debtPercent}%
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Interest Rate
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold w-12 text-gray-900 dark:text-white">{interestRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Entry Multiple:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{purchaseMultiple}x EBITDA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Exit Multiple:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{exitMultiple}x EBITDA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Leverage:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{debtPercent}% Debt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Hold Period:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{holdPeriod} years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Returns Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="h-5 w-5" />
                  <p className="text-sm opacity-90">IRR</p>
                </div>
                <p className="text-4xl font-bold">{(results.returns.irr * 100).toFixed(1)}%</p>
                <p className="text-sm mt-1 opacity-90">Internal Rate of Return</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <p className="text-sm opacity-90">MOIC</p>
                </div>
                <p className="text-4xl font-bold">{results.returns.moic.toFixed(2)}x</p>
                <p className="text-sm mt-1 opacity-90">Multiple on Invested Capital</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <p className="text-sm opacity-90">Equity Entry</p>
                </div>
                <p className="text-4xl font-bold">${(results.returns.entry_equity / 1e9).toFixed(2)}B</p>
                <p className="text-sm mt-1 opacity-90">Initial Investment</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <p className="text-sm opacity-90">Equity Exit</p>
                </div>
                <p className="text-4xl font-bold">${(results.returns.exit_equity / 1e9).toFixed(2)}B</p>
                <p className="text-sm mt-1 opacity-90">Exit Value</p>
              </div>
            </div>

            {/* Sources and Uses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Sources of Funds</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <span className="text-gray-700 dark:text-gray-300">Debt</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(results.sources_and_uses.sources.debt / 1e9).toFixed(2)}B
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <span className="text-gray-700 dark:text-gray-300">Equity</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(results.sources_and_uses.sources.equity / 1e9).toFixed(2)}B
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-2 border-blue-200 dark:border-blue-800">
                    <span className="font-semibold text-gray-900 dark:text-white">Total Sources</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      ${(results.sources_and_uses.sources.total / 1e9).toFixed(2)}B
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Uses of Funds</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <span className="text-gray-700 dark:text-gray-300">Purchase Price</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(results.sources_and_uses.uses.purchase_price / 1e9).toFixed(2)}B
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <span className="text-gray-700 dark:text-gray-300">Transaction Fees</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${(results.sources_and_uses.uses.transaction_fees / 1e9).toFixed(2)}B
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded border-2 border-purple-200 dark:border-purple-800">
                    <span className="font-semibold text-gray-900 dark:text-white">Total Uses</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      ${(results.sources_and_uses.uses.total / 1e9).toFixed(2)}B
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Projections Table */}
            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">{holdPeriod}-Year Projections</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300 dark:border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-900 dark:text-white">Year</th>
                      <th className="text-right py-3 px-2 text-gray-900 dark:text-white">Revenue</th>
                      <th className="text-right py-3 px-2 text-gray-900 dark:text-white">EBITDA</th>
                      <th className="text-right py-3 px-2 text-gray-900 dark:text-white">FCF</th>
                      <th className="text-right py-3 px-2 text-gray-900 dark:text-white">Debt Paydown</th>
                      <th className="text-right py-3 px-2 text-gray-900 dark:text-white">Debt Balance</th>
                      <th className="text-right py-3 px-2 text-gray-900 dark:text-white">Equity Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.projections.map((proj: any) => (
                      <tr key={proj.year} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">{proj.year}</td>
                        <td className="text-right py-3 px-2 text-gray-900 dark:text-white">${(proj.revenue / 1e9).toFixed(2)}B</td>
                        <td className="text-right py-3 px-2 text-gray-900 dark:text-white">${(proj.ebitda / 1e9).toFixed(2)}B</td>
                        <td className="text-right py-3 px-2 text-green-600 dark:text-green-400">${(proj.fcf / 1e9).toFixed(2)}B</td>
                        <td className="text-right py-3 px-2 text-blue-600 dark:text-blue-400">${(proj.debt_paydown / 1e9).toFixed(2)}B</td>
                        <td className="text-right py-3 px-2 text-gray-900 dark:text-white">${(proj.debt_balance / 1e9).toFixed(2)}B</td>
                        <td className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">${(proj.equity_value / 1e9).toFixed(2)}B</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Investment Thesis */}
            <div className={`rounded-lg p-6 border-2 ${
              results.returns.irr > 0.25 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600' 
                : results.returns.irr > 0.15 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600'
            }`}>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {results.returns.irr > 0.25 ? 'Excellent Investment 🎯' : results.returns.irr > 0.15 ? 'Good Investment 👍' : 'Moderate Returns ⚠️'}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                This LBO generates a <span className="font-bold">{(results.returns.irr * 100).toFixed(1)}% IRR</span> and 
                <span className="font-bold"> {results.returns.moic.toFixed(2)}x MOIC</span> over {holdPeriod} years, 
                turning a <span className="font-semibold">${(results.returns.entry_equity / 1e9).toFixed(2)}B</span> equity 
                investment into <span className="font-semibold">${(results.returns.exit_equity / 1e9).toFixed(2)}B</span> at exit.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
