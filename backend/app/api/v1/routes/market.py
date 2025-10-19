from fastapi import APIRouter, HTTPException
from app.services.data.yahoo_finance import YahooFinanceService

router = APIRouter()
yahoo_service = YahooFinanceService()

@router.get("/overview")
async def get_market_overview():
    """Get major market indices overview"""
    try:
        market_data = yahoo_service.get_market_data()
        return {"success": True, "data": market_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/movers")
async def get_market_movers():
    """Get top gainers and losers"""
    try:
        movers = yahoo_service.get_market_movers(limit=5)
        return {"success": True, "gainers": movers["gainers"], "losers": movers["losers"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))