from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.services.data.yahoo_finance import YahooFinanceService
from app.services.modeling.dcf import DCFModel
from app.schemas.analysis import DCFInputs

router = APIRouter()
yahoo_service = YahooFinanceService()

class QuickAnalysisRequest(BaseModel):
    ticker: str

@router.post("/quick")
async def quick_analysis(request: QuickAnalysisRequest):
    """Quick analysis - fetches data and runs default DCF"""
    ticker = request.ticker.upper()
    
    try:
        company_info = yahoo_service.get_company_info(ticker)
        dcf_inputs_dict = yahoo_service.get_dcf_inputs(ticker)
        dcf_inputs = DCFInputs(**dcf_inputs_dict)
        dcf_model = DCFModel(dcf_inputs)
        results = dcf_model.run()
        
        return {
            "success": True,
            "ticker": ticker,
            "company_name": company_info["name"],
            "current_price": company_info["current_price"],
            "dcf_results": results.dict(),
            "upside": round(((results.value_per_share - company_info["current_price"]) / company_info["current_price"]) * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/company/{ticker}")
async def get_company_data(ticker: str):
    """Get comprehensive company data"""
    ticker = ticker.upper()
    
    try:
        company_info = yahoo_service.get_company_info(ticker)
        dcf_inputs = yahoo_service.get_dcf_inputs(ticker)
        
        return {
            "success": True,
            "ticker": ticker,
            "info": company_info,
            "dcf_inputs": dcf_inputs
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))