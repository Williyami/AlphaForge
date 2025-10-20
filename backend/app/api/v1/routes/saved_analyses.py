from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.analysis import DCFAnalysis, LBOAnalysis

router = APIRouter()

# Request/Response Models
class SaveDCFRequest(BaseModel):
    ticker: str
    company_name: str
    current_price: float
    fair_value: float
    upside_percent: float
    enterprise_value: float
    equity_value: float
    dcf_results: dict

class SaveLBORequest(BaseModel):
    ticker: str
    company_name: str
    purchase_multiple: float
    exit_multiple: float
    debt_percent: float
    hold_period: int
    irr: float
    moic: float
    entry_equity: float
    exit_equity: float
    lbo_results: dict

# ============ DCF ENDPOINTS ============

@router.post("/dcf/save")
async def save_dcf_analysis(request: SaveDCFRequest, db: Session = Depends(get_db)):
    """
    Save a DCF analysis to database
    
    What this does:
    1. Receives DCF data from frontend
    2. Creates a new row in dcf_analyses table
    3. Returns success message with ID
    """
    try:
        # Create database entry
        analysis = DCFAnalysis(
            user_id=1,  # Temporary - we'll add auth later
            ticker=request.ticker,
            company_name=request.company_name,
            current_price=request.current_price,
            fair_value=request.fair_value,
            upside_percent=request.upside_percent,
            enterprise_value=request.enterprise_value,
            equity_value=request.equity_value,
            dcf_results=request.dcf_results
        )
        
        # Add to database
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        return {
            "success": True,
            "id": analysis.id,
            "message": "DCF analysis saved successfully"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dcf/list")
async def list_dcf_analyses(db: Session = Depends(get_db)):
    """
    Get list of all saved DCF analyses
    
    What this does:
    1. Queries database for all DCF analyses
    2. Returns them sorted by date (newest first)
    """
    try:
        analyses = db.query(DCFAnalysis).filter(
            DCFAnalysis.user_id == 1
        ).order_by(
            DCFAnalysis.created_at.desc()
        ).all()
        
        return {
            "success": True,
            "analyses": [
                {
                    "id": a.id,
                    "ticker": a.ticker,
                    "company_name": a.company_name,
                    "current_price": a.current_price,
                    "fair_value": a.fair_value,
                    "upside_percent": a.upside_percent,
                    "created_at": a.created_at.isoformat()
                }
                for a in analyses
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dcf/{analysis_id}")
async def get_dcf_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """
    Get one specific DCF analysis by ID
    
    What this does:
    1. Looks up analysis by ID
    2. Returns full details including all projections
    """
    try:
        analysis = db.query(DCFAnalysis).filter(
            DCFAnalysis.id == analysis_id
        ).first()
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return {
            "success": True,
            "analysis": {
                "id": analysis.id,
                "ticker": analysis.ticker,
                "company_name": analysis.company_name,
                "current_price": analysis.current_price,
                "fair_value": analysis.fair_value,
                "upside_percent": analysis.upside_percent,
                "enterprise_value": analysis.enterprise_value,
                "equity_value": analysis.equity_value,
                "dcf_results": analysis.dcf_results,
                "created_at": analysis.created_at.isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/dcf/{analysis_id}")
async def delete_dcf_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """
    Delete a DCF analysis
    
    What this does:
    1. Finds analysis by ID
    2. Deletes it from database
    """
    try:
        analysis = db.query(DCFAnalysis).filter(
            DCFAnalysis.id == analysis_id
        ).first()
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        db.delete(analysis)
        db.commit()
        
        return {"success": True, "message": "Analysis deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ============ LBO ENDPOINTS ============

@router.post("/lbo/save")
async def save_lbo_analysis(request: SaveLBORequest, db: Session = Depends(get_db)):
    """Save an LBO analysis"""
    try:
        analysis = LBOAnalysis(
            user_id=1,
            ticker=request.ticker,
            company_name=request.company_name,
            purchase_multiple=request.purchase_multiple,
            exit_multiple=request.exit_multiple,
            debt_percent=request.debt_percent,
            hold_period=request.hold_period,
            irr=request.irr,
            moic=request.moic,
            entry_equity=request.entry_equity,
            exit_equity=request.exit_equity,
            lbo_results=request.lbo_results
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        return {"success": True, "id": analysis.id, "message": "LBO analysis saved"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/lbo/list")
async def list_lbo_analyses(db: Session = Depends(get_db)):
    """List all saved LBO analyses"""
    try:
        analyses = db.query(LBOAnalysis).filter(
            LBOAnalysis.user_id == 1
        ).order_by(
            LBOAnalysis.created_at.desc()
        ).all()
        
        return {
            "success": True,
            "analyses": [
                {
                    "id": a.id,
                    "ticker": a.ticker,
                    "company_name": a.company_name,
                    "irr": a.irr,
                    "moic": a.moic,
                    "entry_equity": a.entry_equity,
                    "exit_equity": a.exit_equity,
                    "created_at": a.created_at.isoformat()
                }
                for a in analyses
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/lbo/{analysis_id}")
async def get_lbo_analysis(analysis_id: int, db: Session = Depends(get_db)):
    """Get specific LBO analysis"""
    try:
        analysis = db.query(LBOAnalysis).filter(
            LBOAnalysis.id == analysis_id
        ).first()
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        return {
            "success": True,
            "analysis": {
                "id": analysis.id,
                "ticker": analysis.ticker,
                "company_name": analysis.company_name,
                "purchase_multiple": analysis.purchase_multiple,
                "exit_multiple": analysis.exit_multiple,
                "debt_percent": analysis.debt_percent,
                "hold_period": analysis.hold_period,
                "irr": analysis.irr,
                "moic": analysis.moic,
                "entry_equity": analysis.entry_equity,
                "exit_equity": analysis.exit_equity,
                "lbo_results": analysis.lbo_results,
                "created_at": analysis.created_at.isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
