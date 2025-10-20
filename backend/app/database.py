from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.analysis import Base
import os

# Database URL - how to connect to PostgreSQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://alphaforge:alphaforge123@localhost:5432/equity_research"
)

# Create engine - the connection to database
engine = create_engine(DATABASE_URL)

# Create session maker - how we talk to database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
def init_db():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created!")

# Dependency for routes
def get_db():
    """Get a database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
