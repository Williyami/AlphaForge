.PHONY: help install start test

help:
	@echo "AlphaForge Commands:"
	@echo "  make install  - Install dependencies"
	@echo "  make test     - Run tests"

install:
	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

test:
	bash scripts/test-setup.sh
