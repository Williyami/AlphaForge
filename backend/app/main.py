from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# Import routes first (they don't need models)
from app.api.v1.routes import analysis, market, lbo, saved_analyses, tiers

app = FastAPI(
    title="AlphaForge API",
    description="AI-Powered Equity Research Platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables - import models here AFTER Base is defined
@app.on_event("startup")
async def startup_event():
    # Import models here to avoid circular imports
    from app.models import user, analysis as analysis_models
    
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created!")
    print("🚀 AlphaForge API started!")
    print("📊 Database initialized!")

# Include routers
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(market.router, prefix="/api/v1/market", tags=["market"])
app.include_router(lbo.router, prefix="/api/v1/lbo", tags=["lbo"])
app.include_router(saved_analyses.router, prefix="/api/v1/saved", tags=["saved"])
app.include_router(tiers.router, prefix="/api/v1", tags=["tiers"])

@app.get("/")
async def root():
    return {
        "message": "AlphaForge API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
