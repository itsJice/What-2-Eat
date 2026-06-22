# What 2 Eat

What 2 Eat is an MVP for an AI-powered dining assistant that helps people with dietary restrictions decide what to order quickly and confidently.

## Current MVP

- Dietary DNA profile setup
- Taste Profile chips for eating style, foods avoided, favorites, dislikes, and goals
- Menu scan screen with local image preview
- AI scan backend with mock mode and budget caps
- Scan results grouped as safe, modify, and avoid
- Copyable order instructions
- Saved Meals library stored in browser local storage
- Restaurant search preview with compatibility filtering
- Safety language that avoids guaranteeing food safety

## Run

Use one command:

```bash
./start-dev.sh
```

Then open:

```text
http://127.0.0.1:8000/index.html
```

The local `.env` file controls mock mode, the model, and the app-side cost cap:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
AI_MONTHLY_BUDGET_USD=5.00
AI_MAX_COST_PER_SCAN_USD=0.03
AI_SCAN_MOCK=1
```

Mock mode is the default. It tests the app without using an API key or spending money.

To test real AI scans:

```env
OPENAI_API_KEY=sk-your-key-here
AI_SCAN_MOCK=0
```

Then restart:

```bash
./start-dev.sh
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

The backend has an app-level hard stop: it refuses scans once the monthly cap would be exceeded. Provider billing limits should still be set in the API dashboard when available.

Do not commit `.env`, `.venv`, `.ai_usage.json`, or API keys.

## Install on Your Phone

This app is now set up as a Progressive Web App. The practical path is:

1. Deploy the app to an HTTPS URL.
2. Open that URL on your phone.
3. Add it to the Home Screen.

### Deploy on Vercel

Create a Vercel project from this repo and add these environment variables:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4.1-mini
AI_MONTHLY_BUDGET_USD=5.00
AI_MAX_COST_PER_SCAN_USD=0.03
AI_SCAN_MOCK=0
SPOONACULAR_API_KEY=
```

The included `vercel.json` routes the FastAPI app through `api/index.py`, so the frontend and `/api/*` endpoints are served from the same domain.

For a first phone test without spending money, set:

```env
AI_SCAN_MOCK=1
```

### Add to iPhone Home Screen

1. Open the deployed HTTPS URL in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Confirm the name What 2 Eat.
5. Launch it from the new Home Screen icon.

Camera access requires HTTPS and a user permission prompt. The menu scanner uses live camera capture when available and also supports taking or uploading a photo through the file picker.

## Later Backend Needs

- User accounts
- Database-backed Dietary DNA profiles
- Saved meals synced across devices
- Real menu photo OCR
- AI menu analysis API
- Image upload and storage
- Restaurant search and maps
- Online menu ingestion
- Grocery-store barcode scan mode using Open Food Facts for packaged food lookup, ingredient labels, allergen traces, additives, and nutrition
