from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    """User accounts - who owns the analyses"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    dcf_analyses = relationship("DCFAnalysis", back_populates="user")
    lbo_analyses = relationship("LBOAnalysis", back_populates="user")

class DCFAnalysis(Base):
    """Saved DCF valuations"""
    __tablename__ = "dcf_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ticker = Column(String, index=True)
    company_name = Column(String)
    
    # Valuation Results
    current_price = Column(Float)
    fair_value = Column(Float)
    upside_percent = Column(Float)
    enterprise_value = Column(Float)
    equity_value = Column(Float)
    
    # Full Results (JSON)
    dcf_results = Column(JSON)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="dcf_analyses")

class LBOAnalysis(Base):
    """Saved LBO analyses"""
    __tablename__ = "lbo_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ticker = Column(String, index=True)
    company_name = Column(String)
    
    # LBO Parameters
    purchase_multiple = Column(Float)
    exit_multiple = Column(Float)
    debt_percent = Column(Float)
    hold_period = Column(Integer)
    
    # Returns
    irr = Column(Float)
    moic = Column(Float)
    entry_equity = Column(Float)
    exit_equity = Column(Float)
    
    # Full Results (JSON)
    lbo_results = Column(JSON)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="lbo_analyses")
