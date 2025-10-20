# AI-Powered Equity Research Platform

Automate financial modeling and equity research with AI — enabling anyone from retail investors to professional analysts to generate dynamic DCFs, LBOs, comps, and scenario analyses in seconds.

## Features

- 🤖 AI-powered insights and analysis
- 📊 Automated DCF, LBO, and comparable company analysis
- 📈 Real-time market data integration
- 💬 Natural language query interface
- 📤 Export to Excel/PDF
- 🔐 Secure authentication and user management

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11+
- **Database**: PostgreSQL, Redis
- **AI**: OpenAI GPT-4, Anthropic Claude
- **Data**: Yahoo Finance, FinancialModelingPrep

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.11+

### Setup with Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd equity-research-platform

# Copy environment file and configure
cp .env.example .env
# Edit .env with your API keys

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Setup

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup database
alembic upgrade head

# Run server
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

See `.env.example` for required environment variables.

## Documentation

- [API Documentation](docs/API.md)
- [Setup Guide](docs/SETUP.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines first.


cd backend
python -m venv venv
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd /Users/williameklund/AFproject/equity-research-platform/frontend
npm install
npm run dev
npm install recharts

## Next steps


CHANGE BACK FROM MOCK DATA
Step 2: Save Analysis Feature 
Set up PostgreSQL and save DCF results

Step 3: LBO Model 
Build a complete LBO calculator

Step 4:
Add quick dcf/lbo which is current verison but also advanced which allows the user to input levered/unlevered, riskpremium and so on.
