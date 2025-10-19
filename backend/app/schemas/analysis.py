from pydantic import BaseModel
from typing import List, Dict

class DCFInputs(BaseModel):
    ticker: str
    base_revenue: float
    revenue_growth: float
    ebitda_margin: float
    net_margin: float = 0.15
    capex_percent: float = 0.05
    da_percent: float = 0.03
    nwc_percent: float = 0.02
    tax_rate: float = 0.21
    wacc: float = 0.08
    terminal_growth_rate: float = 0.025
    projection_years: int = 10
    net_debt: float
    shares_outstanding: float
    current_price: float = 0

class DCFOutputs(BaseModel):
    projections: List[Dict]
    enterprise_value: float
    equity_value: float
    value_per_share: float
    pv_fcf: float
    pv_terminal: float