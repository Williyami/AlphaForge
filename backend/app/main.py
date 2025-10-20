from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import analysis, market, lbo, saved_analyses
from app.database import init_db

app = FastAPI(
    title="AlphaForge API",
    description="AI-Powered Equity Research Platform",
    version="1.0.0"
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Create database tables when app starts"""
    init_db()
    print("🚀 AlphaForge API started!")
    print("📊 Database initialized!")

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
app.include_router(saved_analyses.router, prefix="/api/v1/saved", tags=["saved"])

@app.get("/")
async def root():
    return {"message": "AlphaForge API - Equity Research Platform"}

@app.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}
