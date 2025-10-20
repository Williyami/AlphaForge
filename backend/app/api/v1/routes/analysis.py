from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.data.mock_data import MockDataService
from app.services.modeling.dcf import DCFModel
from app.services.modeling.scenarios import ScenarioAnalysis
from app.schemas.analysis import DCFInputs, ScenarioAnalysisResponse, ScenarioResult

router = APIRouter()
data_service = MockDataService()

class QuickAnalysisRequest(BaseModel):
    ticker: str

@router.post("/quick")
async def quick_analysis(request: QuickAnalysisRequest):
    """Quick analysis using mock data"""
    ticker = request.ticker.upper()
    
    try:
        company_info = data_service.get_company_info(ticker)
        dcf_inputs_dict = data_service.get_dcf_inputs(ticker)
        dcf_inputs = DCFInputs(**dcf_inputs_dict)
        dcf_model = DCFModel(dcf_inputs)
        results = dcf_model.run()
        
        upside = round(((results.value_per_share - company_info["current_price"]) / company_info["current_price"]) * 100, 2)
        
        return {
            "success": True,
            "ticker": ticker,
            "company_name": company_info["name"],
            "current_price": company_info["current_price"],
            "dcf_results": results.dict(),
            "upside": upside
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/scenarios", response_model=ScenarioAnalysisResponse)
async def scenario_analysis(request: QuickAnalysisRequest):
    """Generate Bull/Base/Bear scenario analysis"""
    ticker = request.ticker.upper()
    
    try:
        # Get company info and base inputs
        company_info = data_service.get_company_info(ticker)
        dcf_inputs_dict = data_service.get_dcf_inputs(ticker)
        base_inputs = DCFInputs(**dcf_inputs_dict)
        
        # Run base case DCF
        base_model = DCFModel(base_inputs)
        base_results = base_model.run()
        
        # Generate scenarios
        scenario_service = ScenarioAnalysis(base_inputs)
        scenarios = scenario_service.generate_scenarios()
        
        return ScenarioAnalysisResponse(
            success=True,
            ticker=ticker,
            company_name=company_info["name"],
            current_price=company_info["current_price"],
            scenarios=scenarios,
            base_case=base_results
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/company/{ticker}")
async def get_company_data(ticker: str):
    """Get company data"""
    ticker = ticker.upper()
    
    try:
        company_info = data_service.get_company_info(ticker)
        dcf_inputs = data_service.get_dcf_inputs(ticker)
        
        return {
            "success": True,
            "ticker": ticker,
            "info": company_info,
            "dcf_inputs": dcf_inputs
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
