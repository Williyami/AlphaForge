from pydantic import BaseModel
from typing import List, Dict, Optional

class DCFInputs(BaseModel):
    ticker: str
    base_revenue: float
    revenue_growth: float
    ebitda_margin: float
    net_margin: float
    capex_percent: float
    da_percent: float
    nwc_percent: float
    tax_rate: float
    wacc: float
    terminal_growth_rate: float
    projection_years: int
    net_debt: float
    shares_outstanding: float
    current_price: float

class DCFOutputs(BaseModel):
    projections: List[Dict]
    enterprise_value: float
    equity_value: float
    value_per_share: float
    pv_fcf: float
    pv_terminal: float

class ScenarioAnalysisRequest(BaseModel):
    ticker: str
    base_inputs: Optional[DCFInputs] = None

class ScenarioResult(BaseModel):
    scenario: str
    value_per_share: float
    upside: float
    enterprise_value: float
    equity_value: float
    assumptions: Dict

class ScenarioAnalysisResponse(BaseModel):
    success: bool
    ticker: str
    company_name: str
    current_price: float
    scenarios: Dict[str, ScenarioResult]
    base_case: DCFOutputs
