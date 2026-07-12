# AI Investment Research Agent

This project was built for the InsideIIM × Altuni AI Labs AI Product Development Engineer Intern take-home assignment.

## Overview
The AI Investment Research Agent is a full-stack application that analyzes real-time financial and news data for any publicly traded company and provides an AI-generated investment recommendation (INVEST, PASS, or WATCHLIST).

## Features
- **Real-Time Data Integration**: Fetches data from Finnhub, Alpha Vantage, and NewsAPI.
- **AI Analysis**: Uses Google's Gemini API to analyze complex financial metrics and recent news.
- **Clean UI**: Modern, responsive React frontend.
- **Robust Error Handling**: Fallbacks and proper messaging when APIs fail or data is missing.

## Tech Stack
- **Frontend**: React (Vite), Axios, simple modern CSS.
- **Backend**: Node.js, Express, Axios.
- **AI**: `@google/generative-ai` (Gemini API).
- **APIs**: Finnhub API, Alpha Vantage API, NewsAPI.

## Project Structure
```
ai-investment-agent/
  frontend/                # React App
    package.json
    src/
      App.jsx              # Main UI Logic
      main.jsx
      App.css              # Styling
  backend/                 # Express Server
    package.json
    server.js              # Server entry point
    .env.example           # Environment variables template
    routes/
      researchRoutes.js    # API routing
    services/
      finnhubService.js    # Finnhub API integration
      alphaVantageService.js # Alpha Vantage API integration
      newsService.js       # NewsAPI integration
      geminiService.js     # Gemini AI prompt and logic
  README.md                # This file
```

## How to get API keys
1. **Gemini API**: Create a Google AI Studio account and generate an API key.
2. **Finnhub**: Sign up at [finnhub.io](https://finnhub.io/) for a free API key.
3. **Alpha Vantage**: Claim a free API key at [alphavantage.co](https://www.alphavantage.co/).
4. **NewsAPI**: Get a key from [newsapi.org](https://newsapi.org/).

## Environment Variables
In the `backend/` directory, copy `.env.example` to a new file called `.env` and fill in your keys:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
FINNHUB_API_KEY=your_finnhub_api_key
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
NEWS_API_KEY=your_news_api_key
```

## How to run backend
```bash
cd backend
npm install
npm start (or node server.js)
```
The server will start on `http://localhost:5000`.

## How to run frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible via a local URL (typically `http://localhost:5173`).

## How it works
1. The user inputs a company name or ticker (e.g., AAPL, TCS).
2. The React frontend sends a POST request to `/api/research`.
3. The Express backend fetches financial data and news in parallel from the three external APIs.
4. The collected data is merged into a comprehensive JSON payload.
5. The Gemini API analyzes this payload and returns a structured JSON response.
6. The backend forwards the result to the frontend.
7. The frontend renders the decision (INVEST/PASS/WATCHLIST), financial metrics, reasons, risks, and verdict in a user-friendly UI.

## Key decisions and trade-offs
- **Parallel API fetching**: Used `Promise.all` in the research route to fetch Finnhub, Alpha Vantage, and NewsAPI data concurrently to significantly improve response times.
- **Fail-gracefully architecture**: Added `.catch()` blocks inside the `Promise.all` in the services so that if one external API fails (or hits rate limits), the backend still forwards the partial data to Gemini. Gemini is instructed to note if data is missing, ensuring the app doesn't crash completely.
- **Vite for React**: Chosen over Create React App because it is the modern standard, offering much faster cold starts and Hot Module Replacement (HMR).

## Example runs
- **Input**: "AAPL" -> AI analyzes Apple's high market cap and recent AI announcements -> Recommends "INVEST" or "WATCHLIST" with a confidence score.
- **Input**: "WeWork" -> AI sees poor financials and negative news -> Recommends "PASS".

## What I would improve with more time
1. Add caching (e.g., Redis) for API responses to avoid hitting rate limits on free API tiers.
2. Add comprehensive unit and integration tests (Jest, Supertest, React Testing Library).
3. Dockerize both frontend and backend for a simpler one-command startup process (`docker-compose up`).
4. Implement WebSockets for streaming Gemini responses (Server-Sent Events) so the user sees analysis generating in real-time instead of waiting for a single long request.
