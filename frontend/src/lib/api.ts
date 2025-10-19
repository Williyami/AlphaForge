const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  getMarketOverview: async () => {
    const res = await fetch(`${API_URL}/api/v1/market/overview`);
    return res.json();
  },
  
  getMarketMovers: async () => {
    const res = await fetch(`${API_URL}/api/v1/market/movers`);
    return res.json();
  },
  
  quickAnalysis: async (ticker: string) => {
    const res = await fetch(`${API_URL}/api/v1/analysis/quick`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker })
    });
    return res.json();
  },
  
  getCompanyData: async (ticker: string) => {
    const res = await fetch(`${API_URL}/api/v1/analysis/company/${ticker}`);
    return res.json();
  }
};