from fastapi import APIRouter

router = APIRouter()

TIER_FEATURES = {
    "free": {
        "name": "Free",
        "price": 0,
        "monthly_analyses": 10,
        "features": [
            "Basic DCF Models",
            "Basic LBO Models",
            "Save up to 10 analyses",
            "Export to Excel",
            "Yahoo Finance data",
            "Community support"
        ],
        "limitations": [
            "10 analyses per month",
            "Limited historical data",
            "No advanced features",
            "No AI insights"
        ]
    },
    "premium": {
        "name": "Premium",
        "price": 49,
        "monthly_analyses": 100,
        "features": [
            "Everything in Free, plus:",
            "Advanced DCF with custom inputs",
            "Advanced LBO scenarios",
            "Unlimited saved analyses",
            "Scenario analysis (Bear/Base/Bull)",
            "Comparable company analysis",
            "5 years historical data",
            "Real-time market data",
            "Priority email support",
            "Export to PDF",
            "Advanced charts & visualizations"
        ],
        "popular": True
    },
    "enterprise": {
        "name": "Enterprise",
        "price": "Custom",
        "monthly_analyses": "Unlimited",
        "features": [
            "Everything in Premium, plus:",
            "AI Research Agent for equity analysis",
            "Connect your FactSet license",
            "Connect your Morningstar license",
            "Custom data source integrations",
            "API access for automation",
            "White-label options",
            "10+ years historical data",
            "Dedicated account manager",
            "Priority phone & chat support",
            "Custom model templates",
            "Team collaboration features",
            "SSO & advanced security"
        ],
        "contact_sales": True
    }
}

@router.get("/tiers")
async def get_tiers():
    """Get all available subscription tiers"""
    return {
        "success": True,
        "tiers": TIER_FEATURES
    }

@router.get("/tiers/{tier_name}")
async def get_tier_details(tier_name: str):
    """Get details for a specific tier"""
    tier = TIER_FEATURES.get(tier_name.lower())
    if not tier:
        return {"success": False, "error": "Tier not found"}
    
    return {
        "success": True,
        "tier": tier
    }
