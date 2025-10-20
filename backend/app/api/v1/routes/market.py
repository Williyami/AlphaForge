from fastapi import APIRouter, HTTPException
from app.services.data.mock_data import MockDataService

router = APIRouter()
data_service = MockDataService()  # Changed from YahooFinanceService

# from app.services.data.yahoo_finance import YahooFinanceService
# data_service = YahooFinanceService()  # Change back from MockDataService


@router.get("/overview")
async def get_market_overview():
    """Get market overview"""
    try:
        market_data = data_service.get_market_data()
        return {"success": True, "data": market_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/movers")
async def get_market_movers():
    """Get market movers"""
    try:
        movers = data_service.get_market_movers(limit=5)
        return {"success": True, "gainers": movers["gainers"], "losers": movers["losers"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))