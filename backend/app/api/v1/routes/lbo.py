from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.data.mock_data import MockDataService
from app.services.modeling.lbo import LBOModel
from app.schemas.lbo import LBOInputs, LBOOutputs

router = APIRouter()
data_service = MockDataService()

class LBORequest(BaseModel):
    ticker: str
    purchase_multiple: float = 10.0  # Default 10x EBITDA
    exit_multiple: float = 10.0
    debt_percent: float = 0.60  # 60% debt
    interest_rate: float = 0.06  # 6%
    hold_period: int = 5

@router.post("/calculate", response_model=LBOOutputs)
async def calculate_lbo(request: LBORequest):
    """Calculate LBO returns"""
    ticker = request.ticker.upper()
    
    try:
        # Get company data
        company_info = data_service.get_company_info(ticker)
        dcf_inputs = data_service.get_dcf_inputs(ticker)
        
        # Calculate purchase price based on EBITDA multiple
        base_revenue = dcf_inputs["base_revenue"]
        ebitda_margin = dcf_inputs["ebitda_margin"]
        base_ebitda = base_revenue * ebitda_margin
        purchase_price = base_ebitda * request.purchase_multiple
        
        # Create LBO inputs
        lbo_inputs = LBOInputs(
            ticker=ticker,
            company_name=company_info["name"],
            purchase_price=purchase_price,
            purchase_multiple=request.purchase_multiple,
            exit_multiple=request.exit_multiple,
            debt_percent=request.debt_percent,
            interest_rate=request.interest_rate,
            base_revenue=base_revenue,
            revenue_growth=dcf_inputs["revenue_growth"],
            ebitda_margin=ebitda_margin,
            capex_percent=dcf_inputs["capex_percent"],
            nwc_percent=dcf_inputs["nwc_percent"],
            tax_rate=dcf_inputs["tax_rate"],
            hold_period=request.hold_period,
            management_fees=0.02  # 2% annual management fee
        )
        
        # Run LBO model
        lbo_model = LBOModel(lbo_inputs)
        results = lbo_model.run()
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
