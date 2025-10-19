from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(title="AlphaForge API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.routes import analysis, market

app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(market.router, prefix="/api/v1/market", tags=["market"])

@app.get("/")
def root():
    return {"message": "AlphaForge API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}