from pydantic import BaseModel
from typing import List, Dict

class LBOInputs(BaseModel):
    # Transaction Details
    ticker: str
    company_name: str
    purchase_price: float  # Enterprise Value
    purchase_multiple: float  # EV/EBITDA multiple
    exit_multiple: float  # Exit EV/EBITDA multiple
    
    # Debt Structure
    debt_percent: float  # % of purchase price financed with debt
    interest_rate: float  # Weighted average interest rate
    
    # Operating Assumptions
    base_revenue: float
    revenue_growth: float
    ebitda_margin: float
    capex_percent: float
    nwc_percent: float
    tax_rate: float
    
    # Other
    hold_period: int  # Years (typically 5)
    management_fees: float  # Annual % of invested capital

class LBOProjection(BaseModel):
    year: int
    revenue: float
    ebitda: float
    capex: float
    nwc_change: float
    free_cash_flow: float
    debt_balance: float
    equity_value: float

class LBOReturns(BaseModel):
    entry_equity: float
    exit_equity: float
    total_return: float
    irr: float  # Internal Rate of Return
    moic: float  # Multiple on Invested Capital
    cash_on_cash: float

class LBOOutputs(BaseModel):
    projections: List[Dict]
    returns: LBOReturns
    sources_and_uses: Dict
    debt_schedule: List[Dict]
