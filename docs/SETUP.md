# Setup Guide

## Prerequisites

- Docker & Docker Compose (recommended)
- OR: Python 3.11+, Node.js 18+, PostgreSQL, Redis

## Quick Start with Docker

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your API keys
3. Run `docker-compose up -d`
4. Access:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Manual Setup

See README.md for detailed manual setup instructions.

## API Keys Required

- OpenAI API Key (for AI insights)
- FinancialModelingPrep API Key (for market data)
- Optional: Anthropic API Key

Get your keys:
- OpenAI: https://platform.openai.com/api-keys
- FMP: https://financialmodelingprep.com/developer/docs/
