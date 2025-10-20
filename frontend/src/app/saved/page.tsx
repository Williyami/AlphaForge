"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Calendar, TrendingUp, TrendingDown, Trash2, ExternalLink } from 'lucide-react';

interface SavedAnalysis {
  id: number;
  ticker: string;
  company_name: string;
  current_price?: number;
  fair_value: number;
  upside_percent: number;
  enterprise_value?: number;
  equity_value?: number;
  created_at: string;
  irr?: number;
  moic?: number;
  entry_equity?: number;
  exit_equity?: number;
}

export default function SavedReports() {
  const [dcfAnalyses, setDcfAnalyses] = useState<SavedAnalysis[]>([]);
  const [lboAnalyses, setLboAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dcf' | 'lbo'>('dcf');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedAnalyses();
  }, []);

  const fetchSavedAnalyses = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const [dcfRes, lboRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/saved/dcf/list`),
        fetch(`${API_URL}/api/v1/saved/lbo/list`)
      ]);

      if (dcfRes.ok) {
        const dcfData = await dcfRes.json();
        setDcfAnalyses(dcfData.analyses || []);
      }

      if (lboRes.ok) {
        const lboData = await lboRes.json();
        setLboAnalyses(lboData.analyses || []);
      }
    } catch (err) {
      console.error('Error fetching saved analyses:', err);
      setError('Failed to load saved analyses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, type: 'dcf' | 'lbo') => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/v1/saved/${type}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        if (type === 'dcf') {
          setDcfAnalyses(prev => prev.filter(a => a.id !== id));
        } else {
          setLboAnalyses(prev => prev.filter(a => a.id !== id));
        }
      }
    } catch (err) {
      console.error('Error deleting analysis:', err);
      alert('Failed to delete analysis');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const currentAnalyses = activeTab === 'dcf' ? dcfAnalyses : lboAnalyses;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading saved analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Saved Reports</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Access your previously saved valuation analyses
          </p>
        </header>

        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('dcf')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'dcf'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            DCF Models ({dcfAnalyses.length})
          </button>
          <button
            onClick={() => setActiveTab('lbo')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'lbo'
                ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            LBO Models ({lboAnalyses.length})
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {currentAnalyses.length === 0 ? (
          <div className="bg-white dark:bg-[#161B22] rounded-lg p-12 text-center border border-gray-200 dark:border-gray-800">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved {activeTab.toUpperCase()} analyses yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start by creating a new {activeTab.toUpperCase()} analysis
            </p>
            <Link
              href={activeTab === 'dcf' ? '/analysis' : '/lbo'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Create {activeTab.toUpperCase()} Analysis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {analysis.ticker}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {analysis.company_name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(analysis.id, activeTab)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                    title="Delete analysis"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {activeTab === 'dcf' ? (
                  <>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Fair Value</span>
                        <span className="font-semibold">{formatCurrency(analysis.fair_value)}</span>
                      </div>
                      {analysis.current_price && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Current Price</span>
                          <span className="font-semibold">{formatCurrency(analysis.current_price)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Upside</span>
                        <span className={`font-semibold flex items-center gap-1 ${
                          analysis.upside_percent > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {analysis.upside_percent > 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {analysis.upside_percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">IRR</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {((analysis.irr || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">MOIC</span>
                        <span className="font-semibold">{(analysis.moic || 0).toFixed(2)}x</span>
                      </div>
                      {analysis.entry_equity && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Entry Equity</span>
                          <span className="font-semibold">{formatCurrency(analysis.entry_equity)}</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    {formatDate(analysis.created_at)}
                  </div>
                  <Link
                    href={activeTab === 'dcf' ? '/analysis' : '/lbo'}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                  >
                    View
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
