"""
Yahoo Finance Data Service
Fetches company financial data for analysis
"""

import yfinance as yf
from typing import Dict, Optional, List
from datetime import datetime, timedelta
import pandas as pd

class YahooFinanceService:
    """Service to fetch financial data from Yahoo Finance"""
    
    def __init__(self):
        self.cache = {}
        
    def get_company_info(self, ticker: str) -> Dict:
        """Get basic company information"""
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            return {
                "ticker": ticker.upper(),
                "name": info.get("longName", ""),
                "sector": info.get("sector", ""),
                "industry": info.get("industry", ""),
                "description": info.get("longBusinessSummary", ""),
                "website": info.get("website", ""),
                "current_price": info.get("currentPrice", 0),
                "market_cap": info.get("marketCap", 0),
                "pe_ratio": info.get("trailingPE", 0),
                "dividend_yield": info.get("dividendYield", 0),
                "beta": info.get("beta", 0),
                "52_week_high": info.get("fiftyTwoWeekHigh", 0),
                "52_week_low": info.get("fiftyTwoWeekLow", 0),
            }
        except Exception as e:
            raise ValueError(f"Could not fetch data for {ticker}: {str(e)}")
    
    def get_dcf_inputs(self, ticker: str) -> Dict:
        """Extract key inputs needed for DCF model"""
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            # Get financial statements
            income_stmt = stock.income_stmt
            balance_sheet = stock.balance_sheet
            cash_flow = stock.cashflow
            
            # Extract latest year data
            latest_income = income_stmt.iloc[:, 0] if not income_stmt.empty else pd.Series()
            latest_balance = balance_sheet.iloc[:, 0] if not balance_sheet.empty else pd.Series()
            latest_cashflow = cash_flow.iloc[:, 0] if not cash_flow.empty else pd.Series()
            
            # Calculate key metrics
            revenue = latest_income.get('Total Revenue', 0)
            ebitda = latest_income.get('EBITDA', 0)
            net_income = latest_income.get('Net Income', 0)
            
            # Get historical revenue for growth calculation
            if not income_stmt.empty and len(income_stmt.columns) >= 2:
                prev_revenue = income_stmt.iloc[:, 1].get('Total Revenue', 0)
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
            shares_outstanding = info.get('sharesOutstanding', 0)
            
            # Get CapEx and D&A
            capex = abs(latest_cashflow.get('Capital Expenditure', 0))
            da = latest_income.get('Reconciled Depreciation', 0)
            
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
                "current_price": float(info.get('currentPrice', 0)),
            }
        except Exception as e:
            raise ValueError(f"Could not calculate DCF inputs for {ticker}: {str(e)}")
    
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
                        "price": round(current, 2),
                        "change": round(change, 2),
                        "change_percent": round(change_percent, 2),
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
                ticker = yf.Ticker(ticker_symbol)
                hist = ticker.history(period="2d")
                info = ticker.info
                
                if len(hist) >= 2:
                    current = hist['Close'].iloc[-1]
                    previous = hist['Close'].iloc[-2]
                    change_percent = ((current - previous) / previous) * 100
                    
                    stock_data = {
                        "ticker": ticker_symbol,
                        "name": info.get('shortName', ticker_symbol),
                        "change_percent": round(change_percent, 2)
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