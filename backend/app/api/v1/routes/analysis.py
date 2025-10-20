from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class DCFRequest(BaseModel):
    ticker: str
    
class ScenarioRequest(BaseModel):
    ticker: str

@router.post("/quick")
async def quick_dcf(request: DCFRequest):
    """Quick DCF analysis using default assumptions"""
    ticker = request.ticker.upper()
    
    # Complete mock response with properly capitalized fields
    return {
        "ticker": ticker,
        "company_name": f"{ticker} Corporation",
        "current_price": 100.00,
        "upside": 10.50,
        "dcf_results": {
            "value_per_share": 110.50,
            "enterprise_value": 50000000000,
            "equity_value": 48000000000,
            "wacc": 0.08,
            "terminal_growth_rate": 0.025,
            "pv_fcf": 20000000000,
            "pv_terminal": 28000000000,
            "projections": [
                {
                    "Year": 1,
                    "Revenue": 100000000000,
                    "EBITDA": 30000000000,
                    "EBIT": 28000000000,
                    "NOPAT": 21000000000,
                    "FCF": 19000000000
                },
                {
                    "Year": 2,
                    "Revenue": 115000000000,
                    "EBITDA": 34500000000,
                    "EBIT": 32200000000,
                    "NOPAT": 24150000000,
                    "FCF": 21850000000
                },
                {
                    "Year": 3,
                    "Revenue": 132250000000,
                    "EBITDA": 39675000000,
                    "EBIT": 37030000000,
                    "NOPAT": 27773000000,
                    "FCF": 25128000000
                },
                {
                    "Year": 4,
                    "Revenue": 152087500000,
                    "EBITDA": 45626250000,
                    "EBIT": 42585000000,
                    "NOPAT": 31939000000,
                    "FCF": 28897000000
                },
                {
                    "Year": 5,
                    "Revenue": 174900625000,
                    "EBITDA": 52470187500,
                    "EBIT": 48972000000,
                    "NOPAT": 36729000000,
                    "FCF": 33231000000
                },
                {
                    "Year": 6,
                    "Revenue": 201135718750,
                    "EBITDA": 60341000000,
                    "EBIT": 56318000000,
                    "NOPAT": 42239000000,
                    "FCF": 38216000000
                },
                {
                    "Year": 7,
                    "Revenue": 231306076563,
                    "EBITDA": 69392000000,
                    "EBIT": 64766000000,
                    "NOPAT": 48575000000,
                    "FCF": 43948000000
                },
                {
                    "Year": 8,
                    "Revenue": 266002988047,
                    "EBITDA": 79801000000,
                    "EBIT": 74481000000,
                    "NOPAT": 55861000000,
                    "FCF": 50540000000
                },
                {
                    "Year": 9,
                    "Revenue": 305903436254,
                    "EBITDA": 91771000000,
                    "EBIT": 85653000000,
                    "NOPAT": 64240000000,
                    "FCF": 58121000000
                },
                {
                    "Year": 10,
                    "Revenue": 351788951692,
                    "EBITDA": 105537000000,
                    "EBIT": 98501000000,
                    "NOPAT": 73876000000,
                    "FCF": 66839000000
                }
            ],
            "terminal_value": 1200000000000,
            "pv_terminal_value": 816326530612,
            "total_pv": 948000000000
        }
    }

@router.post("/scenarios")
async def scenario_analysis(request: ScenarioRequest):
    """Generate Bear, Base, and Bull scenarios"""
    ticker = request.ticker.upper()
    
    base_projections = [
        {"Year": 1, "Revenue": 100000000000, "EBITDA": 30000000000, "EBIT": 28000000000, "NOPAT": 21000000000, "FCF": 19000000000},
        {"Year": 2, "Revenue": 115000000000, "EBITDA": 34500000000, "EBIT": 32200000000, "NOPAT": 24150000000, "FCF": 21850000000},
        {"Year": 3, "Revenue": 132250000000, "EBITDA": 39675000000, "EBIT": 37030000000, "NOPAT": 27773000000, "FCF": 25128000000},
        {"Year": 4, "Revenue": 152087500000, "EBITDA": 45626250000, "EBIT": 42585000000, "NOPAT": 31939000000, "FCF": 28897000000},
        {"Year": 5, "Revenue": 174900625000, "EBITDA": 52470187500, "EBIT": 48972000000, "NOPAT": 36729000000, "FCF": 33231000000},
    ]
    
    return {
        "ticker": ticker,
        "company_name": f"{ticker} Corporation",
        "current_price": 100.00,
        "scenarios": {
            "bear": {
                "value_per_share": 85.30,
                "upside": -14.7,
                "assumptions": {
                    "wacc": 0.10,
                    "terminal_growth": 0.02,
                    "revenue_growth": 0.08,
                    "ebitda_margin": 0.28
                }
            },
            "base": {
                "value_per_share": 110.50,
                "upside": 10.5,
                "assumptions": {
                    "wacc": 0.08,
                    "terminal_growth": 0.025,
                    "revenue_growth": 0.15,
                    "ebitda_margin": 0.30
                }
            },
            "bull": {
                "value_per_share": 135.80,
                "upside": 35.8,
                "assumptions": {
                    "wacc": 0.06,
                    "terminal_growth": 0.03,
                    "revenue_growth": 0.20,
                    "ebitda_margin": 0.32
                }
            }
        },
        "base_case": {
            "enterprise_value": 50000000000,
            "equity_value": 48000000000,
            "wacc": 0.08,
            "terminal_growth_rate": 0.025,
            "projections": base_projections,
            "terminal_value": 1200000000000,
            "pv_terminal_value": 816326530612,
            "total_pv": 948000000000
        },
        "sensitivity_analysis": {
            "wacc_range": [0.06, 0.07, 0.08, 0.09, 0.10],
            "growth_range": [0.015, 0.020, 0.025, 0.030, 0.035],
            "values": [
                [145.2, 135.8, 127.5, 120.1, 113.5],
                [138.5, 129.7, 122.0, 115.2, 109.1],
                [132.3, 124.1, 116.8, 110.5, 104.8],
                [126.5, 118.9, 112.0, 106.0, 100.6],
                [121.1, 114.1, 107.6, 101.9, 96.7]
            ]
        }
    }
