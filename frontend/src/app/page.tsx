"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white transition-colors duration-300 dark:bg-[#0D1117]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl font-bold tracking-tight">AlphaForge</h1>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold">
            O
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Welcome back, Olivia!
        </h2>

        <div className="flex justify-center mb-12">
          <div className="flex w-full md:w-[600px]">
            <input
              type="text"
              placeholder="e.g., 'Generate a DCF model for Apple Inc.'"
              className="flex-grow px-4 py-3 rounded-l-lg bg-[#161B22] text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="px-6 py-3 rounded-r-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Generate
            </button>
          </div>
        </div>

        {/* Start New Analysis */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">
            Start a New Analysis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-[#161B22] hover:bg-[#1E2631] rounded-xl p-6 text-center transition">
              <div className="text-3xl mb-2">📈</div>
              <p className="font-semibold">New DCF</p>
              <p className="text-gray-400 text-sm">Discounted Cash Flow</p>
            </button>
            <button className="bg-[#161B22] hover:bg-[#1E2631] rounded-xl p-6 text-center transition">
              <div className="text-3xl mb-2">🏦</div>
              <p className="font-semibold">New LBO</p>
              <p className="text-gray-400 text-sm">Leveraged Buyout</p>
            </button>
            <button className="bg-[#161B22] hover:bg-[#1E2631] rounded-xl p-6 text-center transition">
              <div className="text-3xl mb-2">💼</div>
              <p className="font-semibold">New Comps</p>
              <p className="text-gray-400 text-sm">Comparable Company Analysis</p>
            </button>
          </div>
        </section>

        {/* Recent Analyses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-300">
              Your Recent Analyses
            </h3>
            <button className="text-blue-500 hover:underline text-sm">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Tesla */}
            <div className="bg-[#161B22] rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
                alt="Tesla DCF"
                width={400}
                height={250}
                className="object-cover h-40 w-full"
              />
              <div className="p-4">
                <h4 className="font-semibold mb-1">Tesla Inc. DCF Model</h4>
                <p className="text-gray-400 text-sm">October 26, 2023</p>
              </div>
            </div>

            {/* Netflix */}
            <div className="bg-[#161B22] rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1517816428104-797678c7cf0c"
                alt="Netflix Comps"
                width={400}
                height={250}
                className="object-cover h-40 w-full"
              />
              <div className="p-4">
                <h4 className="font-semibold mb-1">
                  Netflix Inc. Comps Analysis
                </h4>
                <p className="text-gray-400 text-sm">October 25, 2023</p>
              </div>
            </div>

            {/* Private Equity */}
            <div className="bg-[#161B22] rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
                alt="Private Equity LBO"
                width={400}
                height={250}
                className="object-cover h-40 w-full"
              />
              <div className="p-4">
                <h4 className="font-semibold mb-1">Private Equity LBO Model</h4>
                <p className="text-gray-400 text-sm">October 24, 2023</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
