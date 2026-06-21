#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f ".env" ]; then
  cp ".env.example" ".env"
  echo "Created .env from .env.example"
fi

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

if ! .venv/bin/python -c "import fastapi, uvicorn, requests, multipart, dotenv" >/dev/null 2>&1; then
  .venv/bin/pip install -r requirements.txt
fi

set -a
source ".env"
set +a

echo "What 2 Eat dev server"
echo "Mock mode: ${AI_SCAN_MOCK:-0}"
echo "API key present: $(if [ -n "${OPENAI_API_KEY:-}" ]; then echo yes; else echo no; fi)"
echo "Budget cap: \$${AI_MONTHLY_BUDGET_USD:-5.00}/month, \$${AI_MAX_COST_PER_SCAN_USD:-0.03}/scan"
echo "Open: http://127.0.0.1:8000/index.html"

exec .venv/bin/python -m uvicorn server:app --host 127.0.0.1 --port 8000
