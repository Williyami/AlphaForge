"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { TextLogo } from "@/components/Logo";
import { DCFIcon, LBOIcon, CompsIcon } from "@/components/Icons";

interface SavedAnalysis {
  id: number;
  ticker: string;
  company_name: string;
  fair_value?: number;
  upside_percent?: number;
  irr?: number;
  moic?: number;
  created_at: string;
  type: 'dcf' | 'lbo';
}

export default function Home() {
  const [recentAnalyses, setRecentAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const [dcfRes, lboRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/saved/dcf/list`),
        fetch(`${API_URL}/api/v1/saved/lbo/list`)
      ]);

      const analyses: SavedAnalysis[] = [];

      if (dcfRes.ok) {
        const dcfData = await dcfRes.json();
        const dcfAnalyses = (dcfData.analyses || []).map((a: any) => ({
          ...a,
          type: 'dcf' as const
        }));
        analyses.push(...dcfAnalyses);
      }

      if (lboRes.ok) {
        const lboData = await lboRes.json();
        const lboAnalyses = (lboData.analyses || []).map((a: any) => ({
          ...a,
          type: 'lbo' as const
        }));
        analyses.push(...lboAnalyses);
      }

      analyses.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentAnalyses(analyses.slice(0, 3));
    } catch (err) {
      console.error('Error fetching recent analyses:', err);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-[#0D1117] dark:via-[#0D1117] dark:to-[#0D1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <TextLogo />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            AI-Powered Financial Analysis
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Generate professional DCF models, LBO analyses, and comparable company valuations in seconds
          </p>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-300">
            Start New Analysis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/analysis"
              className="group bg-white dark:bg-[#161B22] hover:bg-gray-50 dark:hover:bg-[#1E2631] rounded-xl p-8 text-center transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <DCFIcon className="w-16 h-16" />
              </div>
              <p className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">New DCF</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Discounted Cash Flow</p>
            </Link>

            <Link
              href="/lbo"
              className="group bg-white dark:bg-[#161B22] hover:bg-gray-50 dark:hover:bg-[#1E2631] rounded-xl p-8 text-center transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20"
            >
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <LBOIcon className="w-16 h-16" />
              </div>
              <p className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">New LBO</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Leveraged Buyout</p>
            </Link>

            <Link
              href="/analysis"
              className="group bg-white dark:bg-[#161B22] hover:bg-gray-50 dark:hover:bg-[#1E2631] rounded-xl p-8 text-center transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
                <CompsIcon className="w-16 h-16" />
              </div>
              <p className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">New Comps</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Comparable Company Analysis</p>
            </Link>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">
              Your Recent Analyses
            </h3>
            <Link 
              href="/saved"
              className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium flex items-center gap-1 transition"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-[#161B22] rounded-xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
                  <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : recentAnalyses.length === 0 ? (
            <div className="bg-white dark:bg-[#161B22] rounded-xl p-12 text-center border border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No saved analyses yet. Create your first analysis to get started!
              </p>
              <Link
                href="/analysis"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
              >
                Create Analysis
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis.id}
                  href={analysis.type === 'dcf' ? '/analysis' : '/lbo'}
                  className="group bg-white dark:bg-[#161B22] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                >
                  <div className={`relative h-40 bg-gradient-to-br overflow-hidden ${
                    analysis.type === 'dcf' 
                      ? 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950'
                      : 'from-green-100 to-green-200 dark:from-green-900 dark:to-green-950'
                  }`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/20">
                        {analysis.ticker}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#161B22] to-transparent opacity-60" />
                    <div className={`absolute top-3 right-3 text-white text-xs px-3 py-1 rounded-full font-medium ${
                      analysis.type === 'dcf' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {analysis.type.toUpperCase()}
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {analysis.ticker} - {analysis.company_name}
                    </h4>
                    
                    {analysis.type === 'dcf' ? (
                      <div className="flex items-center gap-2 mb-2">
                        {analysis.fair_value && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Fair Value: {formatCurrency(analysis.fair_value)}
                          </span>
                        )}
                        {analysis.upside_percent !== undefined && (
                          <span className={`text-sm font-semibold flex items-center gap-1 ${
                            analysis.upside_percent > 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {analysis.upside_percent > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {analysis.upside_percent.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 mb-2">
                        {analysis.irr !== undefined && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            IRR: <span className="font-semibold text-green-600 dark:text-green-400">
                              {(analysis.irr * 100).toFixed(1)}%
                            </span>
                          </span>
                        )}
                        {analysis.moic !== undefined && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            MOIC: <span className="font-semibold">{analysis.moic.toFixed(2)}x</span>
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {formatDate(analysis.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
