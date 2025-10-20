from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import analysis, market, lbo

app = FastAPI(
    title="AlphaForge API",
    description="AI-Powered Equity Research Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(market.router, prefix="/api/v1/market", tags=["market"])
app.include_router(lbo.router, prefix="/api/v1/lbo", tags=["lbo"])

@app.get("/")
async def root():
    return {"message": "AlphaForge API - Equity Research Platform"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
