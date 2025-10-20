from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

# Import User from user.py instead of defining it here
from app.models.user import User

class DCFAnalysis(Base):
    __tablename__ = "dcf_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Company Info
    ticker = Column(String, nullable=False, index=True)
    company_name = Column(String, nullable=False)
    
    # Key Results
    current_price = Column(Float)
    fair_value = Column(Float, nullable=False)
    upside_percent = Column(Float, nullable=False)
    enterprise_value = Column(Float)
    equity_value = Column(Float)
    
    # Full DCF Results (JSON)
    dcf_results = Column(JSON, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class LBOAnalysis(Base):
    __tablename__ = "lbo_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Company Info
    ticker = Column(String, nullable=False, index=True)
    company_name = Column(String, nullable=False)
    
    # LBO Inputs
    purchase_multiple = Column(Float, nullable=False)
    exit_multiple = Column(Float, nullable=False)
    debt_percent = Column(Float, nullable=False)
    hold_period = Column(Integer, nullable=False)
    
    # Key Results
    irr = Column(Float, nullable=False)
    moic = Column(Float, nullable=False)
    entry_equity = Column(Float)
    exit_equity = Column(Float)
    
    # Full LBO Results (JSON)
    lbo_results = Column(JSON, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
