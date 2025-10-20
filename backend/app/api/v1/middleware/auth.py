from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserTier

security = HTTPBearer(auto_error=False)

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Get current authenticated user (optional - returns None if not authenticated)"""
    # For now, return default user with ID 1
    # TODO: Implement JWT validation when you add real auth
    user = db.query(User).filter(User.id == 1).first()
    return user

async def get_current_user(
    user: Optional[User] = Depends(get_current_user_optional)
) -> User:
    """Get current authenticated user (required)"""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return user

def require_tier(required_tier: UserTier):
    """Dependency to require specific tier"""
    async def tier_checker(user: User = Depends(get_current_user)):
        tier_hierarchy = {
            UserTier.FREE: 0,
            UserTier.PREMIUM: 1,
            UserTier.ENTERPRISE: 2
        }
        
        if tier_hierarchy.get(user.tier, 0) < tier_hierarchy.get(required_tier, 999):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This feature requires {required_tier.value} tier or higher"
            )
        return user
    return tier_checker

def require_feature(feature: str):
    """Dependency to require specific feature access"""
    async def feature_checker(user: User = Depends(get_current_user)):
        if not user.has_feature(feature):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This feature is not available in your plan. Upgrade to access {feature}."
            )
        return user
    return feature_checker

async def check_usage_limit(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Check if user has remaining analyses"""
    if not user.can_analyze():
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Monthly limit reached. You've used {user.monthly_analyses}/{user.get_monthly_limit()} analyses."
        )
    
    # Increment usage
    user.monthly_analyses += 1
    db.commit()
    return user
