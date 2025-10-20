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
  
  // Safely get projections
  const projections = displayData ? 
    (showScenarios ? 
      displayData.base_case?.projections : 
      displayData.dcf_results?.projections
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
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
              {loading ? 'Analyzing...' : 'Scenarios'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {displayData && (
          <div className="space-y-8">
            {/* Company Header */}
            <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{displayData.ticker}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{displayData.company_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${displayData.current_price?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts - only show if we have projections */}
            {projections && projections.length > 0 && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RevenueGrowthChart data={projections} />
                  <FCFWaterfallChart data={projections} />
                </div>

                {showScenarios && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ScenarioComparisonChart data={scenarios?.scenarios || {}} currentPrice={displayData.current_price} />
                    <ValuationBreakdownChart 
                      data={{
                        pv_fcf: projections.reduce((sum: number, p: any) => sum + (p.pv_fcf || 0), 0),
                        pv_terminal: scenarios?.base_case?.pv_terminal_value || 0
                      }} 
                    />
                  </div>
                )}
              </>
            )}

            {/* No projections message */}
            {(!projections || projections.length === 0) && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-700 dark:text-yellow-400">
                  Charts are unavailable. Projection data is loading or not available for this analysis.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
