"""
Mock Data Service - for testing when Yahoo Finance is blocked
"""
from typing import Dict

class MockDataService:
    """Provides mock financial data for testing"""
    
    def get_company_info(self, ticker: str) -> Dict:
        """Get mock company information"""
        mock_data = {
            "AAPL": {
                "name": "Apple Inc.",
                "current_price": 178.50,
                "market_cap": 2800e9,
            },
            "MSFT": {
                "name": "Microsoft Corporation",
                "current_price": 375.00,
                "market_cap": 2780e9,
            },
            "GOOGL": {
                "name": "Alphabet Inc.",
                "current_price": 140.00,
                "market_cap": 1750e9,
            }
        }
        
        data = mock_data.get(ticker.upper(), {
            "name": f"{ticker.upper()} Inc.",
            "current_price": 150.00,
            "market_cap": 100e9,
        })
        
        return {
            "ticker": ticker.upper(),
            "name": data["name"],
            "sector": "Technology",
            "industry": "Software",
            "description": f"Mock data for {ticker.upper()}",
            "website": f"https://www.{ticker.lower()}.com",
            "current_price": data["current_price"],
            "market_cap": data["market_cap"],
            "pe_ratio": 25.0,
            "dividend_yield": 0.005,
            "beta": 1.2,
            "52_week_high": data["current_price"] * 1.2,
            "52_week_low": data["current_price"] * 0.8,
        }
    
    def get_dcf_inputs(self, ticker: str) -> Dict:
        """Get mock DCF inputs"""
        base_revenues = {
            "AAPL": 394e9,
            "MSFT": 211e9,
            "GOOGL": 282e9,
        }
        
        base_revenue = base_revenues.get(ticker.upper(), 100e9)
        
        return {
            "ticker": ticker.upper(),
            "base_revenue": float(base_revenue),
            "revenue_growth": 0.08,
            "ebitda_margin": 0.30,
            "net_margin": 0.20,
            "capex_percent": 0.05,
            "da_percent": 0.03,
            "nwc_percent": 0.02,
            "tax_rate": 0.21,
            "wacc": 0.09,
            "terminal_growth_rate": 0.025,
            "projection_years": 10,
            "net_debt": 50e9,
            "shares_outstanding": 15.5e9,
            "current_price": self.get_company_info(ticker)["current_price"],
        }
    
    def get_market_data(self) -> Dict:
        """Get mock market data"""
        return {
            "S&P 500": {
                "symbol": "^GSPC",
                "name": "S&P 500",
                "price": 4783.45,
                "change": 23.50,
                "change_percent": 0.49,
                "is_positive": True
            },
            "NASDAQ": {
                "symbol": "^IXIC",
                "name": "NASDAQ",
                "price": 15095.14,
                "change": 45.78,
                "change_percent": 0.30,
                "is_positive": True
            },
            "Dow Jones": {
                "symbol": "^DJI",
                "name": "Dow Jones",
                "price": 37305.16,
                "change": -12.35,
                "change_percent": -0.03,
                "is_positive": False
            }
        }
    
    def get_market_movers(self, limit: int = 5) -> Dict:
        """Get mock market movers"""
        return {
            "gainers": [
                {"ticker": "NVDA", "name": "NVIDIA", "change_percent": 5.2},
                {"ticker": "AMD", "name": "AMD", "change_percent": 3.8},
                {"ticker": "TSLA", "name": "Tesla", "change_percent": 2.5},
                {"ticker": "META", "name": "Meta", "change_percent": 1.9},
                {"ticker": "NFLX", "name": "Netflix", "change_percent": 1.2},
            ],
            "losers": [
                {"ticker": "AAPL", "name": "Apple", "change_percent": -1.5},
                {"ticker": "MSFT", "name": "Microsoft", "change_percent": -0.8},
                {"ticker": "GOOGL", "name": "Alphabet", "change_percent": -0.5},
                {"ticker": "AMZN", "name": "Amazon", "change_percent": -0.3},
                {"ticker": "JPM", "name": "JPMorgan", "change_percent": -0.2},
            ]
        }