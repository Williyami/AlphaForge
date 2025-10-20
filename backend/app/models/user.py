from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class UserTier(str, enum.Enum):
    FREE = "free"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    
    # Tier and Features
    tier = Column(Enum(UserTier), default=UserTier.FREE, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Usage Limits
    monthly_analyses = Column(Integer, default=0)
    total_analyses = Column(Integer, default=0)
    
    # Enterprise Features
    has_factset_access = Column(Boolean, default=False)
    has_morningstar_access = Column(Boolean, default=False)
    factset_username = Column(String, nullable=True)
    morningstar_api_key = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    def get_monthly_limit(self):
        limits = {
            UserTier.FREE: 10,
            UserTier.PREMIUM: 100,
            UserTier.ENTERPRISE: 999999
        }
        return limits.get(self.tier, 10)
    
    def can_analyze(self):
        return self.monthly_analyses < self.get_monthly_limit()
    
    def has_feature(self, feature: str) -> bool:
        """Check if user has access to a specific feature"""
        features = {
            UserTier.FREE: [
                "basic_dcf", "basic_lbo", "save_analyses", 
                "export_excel"
            ],
            UserTier.PREMIUM: [
                "basic_dcf", "basic_lbo", "save_analyses", 
                "export_excel", "advanced_dcf", "advanced_lbo",
                "scenario_analysis", "comps_analysis", 
                "historical_data", "priority_support"
            ],
            UserTier.ENTERPRISE: [
                "basic_dcf", "basic_lbo", "save_analyses", 
                "export_excel", "advanced_dcf", "advanced_lbo",
                "scenario_analysis", "comps_analysis", 
                "historical_data", "priority_support",
                "ai_research_agent", "factset_integration",
                "morningstar_integration", "custom_data_sources",
                "api_access", "white_label", "dedicated_support"
            ]
        }
        return feature in features.get(self.tier, [])
