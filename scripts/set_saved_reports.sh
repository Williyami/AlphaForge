#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Creating Saved Reports Page...${NC}"

# Create the saved reports page
cat > frontend/src/app/saved/page.tsx << 'EOF'
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

        {/* Tabs */}
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
EOF

echo -e "${GREEN}✓ Saved Reports page created${NC}"

echo -e "${BLUE}Updating Homepage...${NC}"

# Update the homepage
cat > frontend/src/app/page.tsx << 'EOF'
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { TextLogo, DCFIcon, LBOIcon, CompsIcon } from "@/components/Logo";

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

      // Sort by date and take most recent 3
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
        {/* Hero Section */}
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

        {/* Quick Actions */}
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

        {/* Recent Analyses */}
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
EOF

echo -e "${GREEN}✓ Homepage updated${NC}"

echo -e "${BLUE}Updating Navigation component...${NC}"

# Update Navigation component
cat > frontend/src/components/Navigation.tsx << 'EOF'
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Home, BarChart3, TrendingUp, FileText, Briefcase, BookmarkCheck } from "lucide-react";
import { TextLogo } from "./Logo";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: TrendingUp },
    { href: "/analysis", label: "Analysis", icon: FileText },
    { href: "/lbo", label: "LBO", icon: Briefcase },
    { href: "/saved", label: "Saved", icon: BookmarkCheck },
  ];

  const currentTheme = theme === 'system' ? systemTheme : theme;

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-[#0D1117]/80 backdrop-blur-md shadow-sm dark:shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <TextLogo />
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 !text-white shadow-lg shadow-blue-600/50"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              aria-label="Toggle theme"
              title={`Switch to ${currentTheme === "dark" ? "light" : "dark"} mode`}
            >
              <div className="relative w-5 h-5">
                {currentTheme === "dark" ? (
                  <Moon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-600 group-hover:text-yellow-500 transition-colors" />
                )}
              </div>
            </button>

            <button className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-bold hover:shadow-lg hover:shadow-blue-600/50 transition-all text-white">
              W
            </button>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 !text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
EOF

echo -e "${GREEN}✓ Navigation component updated${NC}"

echo ""
echo "======================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "Files created/updated:"
echo "  ✓ frontend/src/app/saved/page.tsx"
echo "  ✓ frontend/src/app/page.tsx (updated)"
echo "  ✓ frontend/src/components/Navigation.tsx (updated)"
echo ""
echo "Next steps:"
echo "  1. Test the new pages:"
echo "     cd frontend && npm run dev"
echo ""
echo "  2. Visit these URLs:"
echo "     - Homepage: http://localhost:3000"
echo "     - Saved Reports: http://localhost:3000/saved"
echo ""
echo "  3. Make sure backend is running:"
echo "     cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "Features added:"
echo "  ✓ Saved Reports page with DCF and LBO tabs"
echo "  ✓ Delete functionality for saved analyses"
echo "  ✓ Homepage now shows 3 most recent analyses"
echo "  ✓ Navigation includes 'Saved' link"
echo "  ✓ Proper formatting and styling throughout"
echo ""