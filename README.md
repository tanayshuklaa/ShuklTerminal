# Shukl Terminal – Bloomberg-style Stock Dashboard

Modern, free dashboard for U.S. equities built with **Next.js 14**, **TailwindCSS**, **Recharts**, and powered by **Finnhub** + **Yahoo Finance** free endpoints. Designed for Vercel edge deployment with 60s caching.

## Features
- Live quote overview (price, % change, 52W stats, market cap)
- Interactive price history chart with 1D/1W/1M/3M/6M/1Y ranges (Yahoo Finance)
- Insider trading tape (Finnhub insider transactions)
- Curated company news feed (Finnhub company news)
- Analyst sentiment meter (Finnhub recommendations)
- Lightweight buy/hold/sell signal combining insider flow, analyst sentiment, and 50-day SMA
- Dark, responsive UI with loading skeletons and graceful error fallbacks

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment
Create `.env.local` at the project root:
```env
FINNHUB_API_KEY=your_finnhub_key_here
```

### 3) Run locally
```bash
npm run dev
```
Then open http://localhost:3000 and search any ticker (e.g., AAPL, MSFT, TSLA).

### 4) Production build
```bash
npm run build
npm start
```

## Deployment (Vercel)
- Push this repo to GitHub
- Create a new Vercel project from the repo
- Add `FINNHUB_API_KEY` to Vercel environment variables
- Deploy (Edge runtime is used for API routes, caching set to 60s)

## Project Structure
```
app/
  api/stock/[symbol]      -> Quote + Yahoo chart + financials
  api/insider/[symbol]    -> Finnhub insider transactions
  api/news/[symbol]       -> Finnhub company news
  api/recommendation/[symbol] -> Finnhub analyst sentiment
  components/             -> UI building blocks
  dashboard/[symbol]/     -> Dynamic dashboard page
  globals.css             -> Tailwind base and theme helpers
lib/
  finnhub.js              -> Finnhub helpers
  yahoo.js                -> Yahoo Finance helpers
```

## Notes
- All fetches revalidate every 60 seconds for free-tier friendliness
- API errors surface user-friendly messages; skeletons show while loading
- Chart data uses Yahoo Finance; real-time quote/insider/news use Finnhub

## Buy/Sell/Hold model
```
score = 0
if insider buys > insider sells: +1
if analyst buy > analyst sell: +1
if price > 50-day SMA: +1
if price < 50-day SMA: -1
if sentiment leans positive vs hold: +1
```
Result: score >= 3 → BUY, 1-2 → HOLD, <=0 → SELL.
