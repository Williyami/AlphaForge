"""
Yahoo Finance Data Service with Rate Limiting
"""

import yfinance as yf
from typing import Dict, Optional, List
from datetime import datetime, timedelta
import pandas as pd
import time
from functools import lru_cache

class YahooFinanceService:
    """Service to fetch financial data from Yahoo Finance with rate limiting"""
    
    def __init__(self):
        self.cache = {}
        self.last_request_time = 0
        self.min_request_interval = 2  # 2 seconds between requests
        
    def _rate_limit(self):
        """Ensure minimum time between requests"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.min_request_interval:
            sleep_time = self.min_request_interval - time_since_last
            time.sleep(sleep_time)
        self.last_request_time = time.time()
    
    @lru_cache(maxsize=100)
    def get_company_info(self, ticker: str) -> Dict:
        """Get basic company information"""
        try:
            self._rate_limit()
            stock = yf.Ticker(ticker)
            
            # Use history for price data (more reliable)
            hist = stock.history(period="5d")
            current_price = hist['Close'].iloc[-1] if not hist.empty else 0
            
            # Try to get info, but don't fail if unavailable
            try:
                info = stock.info
            except:
                info = {}
            
            return {
                "ticker": ticker.upper(),
                "name": info.get("longName", ticker.upper()),
                "sector": info.get("sector", "Unknown"),
                "industry": info.get("industry", "Unknown"),
                "description": info.get("longBusinessSummary", ""),
                "website": info.get("website", ""),
                "current_price": float(current_price),
                "market_cap": info.get("marketCap", 0),
                "pe_ratio": info.get("trailingPE", 0),
                "dividend_yield": info.get("dividendYield", 0),
                "beta": info.get("beta", 1.0),
                "52_week_high": info.get("fiftyTwoWeekHigh", 0),
                "52_week_low": info.get("fiftyTwoWeekLow", 0),
            }
        except Exception as e:
            raise ValueError(f"Could not fetch data for {ticker}: {str(e)}")
    
    def get_dcf_inputs(self, ticker: str) -> Dict:
        """Extract key inputs needed for DCF model"""
        try:
            self._rate_limit()
            stock = yf.Ticker(ticker)
            
            # Get financial statements with error handling
            try:
                income_stmt = stock.income_stmt
                balance_sheet = stock.balance_sheet
                cash_flow = stock.cashflow
            except:
                # Use default values if financials not available
                return self._get_default_dcf_inputs(ticker)
            
            # Get current price from history
            hist = stock.history(period="5d")
            current_price = float(hist['Close'].iloc[-1]) if not hist.empty else 100.0
            
            # Extract latest year data
            latest_income = income_stmt.iloc[:, 0] if not income_stmt.empty else pd.Series()
            latest_balance = balance_sheet.iloc[:, 0] if not balance_sheet.empty else pd.Series()
            latest_cashflow = cash_flow.iloc[:, 0] if not cash_flow.empty else pd.Series()
            
            # Calculate key metrics
            revenue = latest_income.get('Total Revenue', 1e9)
            ebitda = latest_income.get('EBITDA', revenue * 0.25)
            net_income = latest_income.get('Net Income', revenue * 0.15)
            
            # Get historical revenue for growth calculation
            if not income_stmt.empty and len(income_stmt.columns) >= 2:
                prev_revenue = income_stmt.iloc[:, 1].get('Total Revenue', revenue * 0.9)
                revenue_growth = (revenue - prev_revenue) / prev_revenue if prev_revenue > 0 else 0.05
            else:
                revenue_growth = 0.05  # Default 5%
            
            # Calculate margins
            ebitda_margin = ebitda / revenue if revenue > 0 else 0.25
            net_margin = net_income / revenue if revenue > 0 else 0.15
            
            # Get balance sheet items
            total_debt = latest_balance.get('Total Debt', 0)
            cash = latest_balance.get('Cash And Cash Equivalents', 0)
            net_debt = total_debt - cash
            
            # Get shares outstanding
            try:
                info = stock.info
                shares_outstanding = info.get('sharesOutstanding', 1e9)
            except:
                shares_outstanding = 1e9
            
            # Get CapEx and D&A
            capex = abs(latest_cashflow.get('Capital Expenditure', revenue * 0.05))
            da = latest_income.get('Reconciled Depreciation', revenue * 0.03)
            
            capex_percent = capex / revenue if revenue > 0 else 0.05
            da_percent = da / revenue if revenue > 0 else 0.03
            
            return {
                "ticker": ticker.upper(),
                "base_revenue": float(revenue),
                "revenue_growth": float(revenue_growth),
                "ebitda_margin": float(ebitda_margin),
                "net_margin": float(net_margin),
                "capex_percent": float(capex_percent),
                "da_percent": float(da_percent),
                "nwc_percent": 0.02,
                "tax_rate": 0.21,
                "wacc": 0.08,
                "terminal_growth_rate": 0.025,
                "projection_years": 10,
                "net_debt": float(net_debt),
                "shares_outstanding": float(shares_outstanding),
                "current_price": float(current_price),
            }
        except Exception as e:
            print(f"Error in get_dcf_inputs: {str(e)}")
            return self._get_default_dcf_inputs(ticker)
    
    def _get_default_dcf_inputs(self, ticker: str) -> Dict:
        """Return default DCF inputs when data is unavailable"""
        return {
            "ticker": ticker.upper(),
            "base_revenue": 100e9,  # $100B
            "revenue_growth": 0.05,
            "ebitda_margin": 0.25,
            "net_margin": 0.15,
            "capex_percent": 0.05,
            "da_percent": 0.03,
            "nwc_percent": 0.02,
            "tax_rate": 0.21,
            "wacc": 0.08,
            "terminal_growth_rate": 0.025,
            "projection_years": 10,
            "net_debt": 10e9,
            "shares_outstanding": 1e9,
            "current_price": 150.0,
        }
    
    def get_market_data(self) -> Dict:
        """Get major market indices data"""
        indices = {
            "^GSPC": "S&P 500",
            "^IXIC": "NASDAQ",
            "^DJI": "Dow Jones"
        }
        
        market_data = {}
        
        for symbol, name in indices.items():
            try:
                self._rate_limit()
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="2d")
                
                if len(hist) >= 2:
                    current = hist['Close'].iloc[-1]
                    previous = hist['Close'].iloc[-2]
                    change = current - previous
                    change_percent = (change / previous) * 100
                    
                    market_data[name] = {
                        "symbol": symbol,
                        "name": name,
                        "price": round(float(current), 2),
                        "change": round(float(change), 2),
                        "change_percent": round(float(change_percent), 2),
                        "is_positive": change >= 0
                    }
            except Exception as e:
                print(f"Error fetching {name}: {e}")
                continue
        
        return market_data
    
    def get_market_movers(self, limit: int = 5) -> Dict:
        """Get top gainers and losers"""
        tickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'AMD', 'NFLX']
        
        gainers = []
        losers = []
        
        for ticker_symbol in tickers:
            try:
                self._rate_limit()
                ticker = yf.Ticker(ticker_symbol)
                hist = ticker.history(period="2d")
                
                if len(hist) >= 2:
                    current = hist['Close'].iloc[-1]
                    previous = hist['Close'].iloc[-2]
                    change_percent = ((current - previous) / previous) * 100
                    
                    stock_data = {
                        "ticker": ticker_symbol,
                        "name": ticker_symbol,  # Use ticker as name for speed
                        "change_percent": round(float(change_percent), 2)
                    }
                    
                    if change_percent > 0:
                        gainers.append(stock_data)
                    else:
                        losers.append(stock_data)
            except:
                continue
        
        gainers = sorted(gainers, key=lambda x: x['change_percent'], reverse=True)[:limit]
        losers = sorted(losers, key=lambda x: x['change_percent'])[:limit]
        
        return {
            "gainers": gainers,
            "losers": losers
        }
