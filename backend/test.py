from app.database import engine, SessionLocal
from app.models.analysis import Base, User
from datetime import datetime

print("🔧 Setting up database...")

# Create all tables
Base.metadata.create_all(bind=engine)
print("✅ Tables created!")

# Create default user
db = SessionLocal()
try:
    existing_user = db.query(User).filter(User.id == 1).first()
    if not existing_user:
        user = User(
            id=1,
            email="william@alphaforge.com",
            username="william",
            hashed_password="temp_hash_will_add_real_auth_later",
            created_at=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        print("✅ User 'william' created!")
    else:
        print("✅ User already exists!")
finally:
    db.close()

print("\n🎉 Database setup complete!")
print("You can now save analyses!")