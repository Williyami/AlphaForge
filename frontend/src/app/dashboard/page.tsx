"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const [marketData, setMarketData] = useState<any>(null);
  const [movers, setMovers] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        const [marketRes, moversRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/market/overview`),
          fetch(`${API_URL}/api/v1/market/movers`)
        ]);

        const market = await marketRes.json();
        const moversData = await moversRes.json();

        setMarketData(market.data);
        setMovers(moversData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] text-gray-900 dark:text-white p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Market Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time market overview and top movers</p>
      </header>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Major Indices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketData && Object.values(marketData).map((index: any) => (
            <div key={index.symbol} className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{index.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{index.symbol}</p>
                </div>
                {index.is_positive ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{index.price.toLocaleString()}</p>
                <p className={`text-sm ${index.is_positive ? 'text-green-500' : 'text-red-500'}`}>
                  {index.is_positive ? '+' : ''}{index.change.toFixed(2)} ({index.change_percent.toFixed(2)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <DollarSign className="h-5 w-5 text-blue-500" />
          Top Movers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Gainers
            </h3>
            <div className="space-y-3">
              {movers?.gainers?.map((stock: any) => (
                <div key={stock.ticker} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#0D1117] rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{stock.ticker}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                  </div>
                  <div className="text-green-500 font-semibold">
                    +{stock.change_percent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#161B22] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Top Losers
            </h3>
            <div className="space-y-3">
              {movers?.losers?.map((stock: any) => (
                <div key={stock.ticker} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#0D1117] rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{stock.ticker}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                  </div>
                  <div className="text-red-500 font-semibold">
                    {stock.change_percent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
