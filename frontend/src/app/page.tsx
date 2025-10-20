"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { DCFIcon, LBOIcon, CompsIcon, TeslaIcon, NetflixIcon, PEIcon } from "@/components/Icons";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, William!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Generate professional valuations and financial models in seconds
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-16">
          <div className="flex w-full md:w-[600px] bg-white dark:bg-[#161B22] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="e.g., 'Generate a DCF model for Apple Inc.'"
              className="flex-grow px-6 py-4 bg-transparent text-gray-900 dark:text-gray-200 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition flex items-center gap-2">
              Generate
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Start New Analysis */}
        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-300">
            Start a New Analysis
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
              href="/analysis"
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
            <button className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium flex items-center gap-1 transition">
              View All
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Tesla Card */}
            <Link
              href="/analysis"
              className="group bg-white dark:bg-[#161B22] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            >
              <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                <TeslaIcon />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#161B22] to-transparent opacity-60" />
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  DCF
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  Tesla Inc. DCF Model
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">October 26, 2024</p>
              </div>
            </Link>

            {/* Netflix Card */}
            <Link
              href="/analysis"
              className="group bg-white dark:bg-[#161B22] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            >
              <div className="relative h-40 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-950 overflow-hidden">
                <NetflixIcon />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#161B22] to-transparent opacity-60" />
                <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Comps
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                  Netflix Inc. Comps Analysis
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">October 25, 2024</p>
              </div>
            </Link>

            {/* Private Equity Card */}
            <Link
              href="/analysis"
              className="group bg-white dark:bg-[#161B22] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
            >
              <div className="relative h-40 bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-900 dark:to-blue-950 overflow-hidden">
                <PEIcon />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#161B22] to-transparent opacity-60" />
                <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  LBO
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition">
                  Private Equity LBO Model
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">October 24, 2024</p>
              </div>
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
}
