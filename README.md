# AI Investment Research Agent 📈

An intelligent, full-stack financial analysis engine that aggregates real-time market telemetry, news sentiment, and core financial metrics to generate actionable investment recommendations.

Designed and implemented for the **InsideIIM × Altuni AI Labs AI Product Development Engineer** evaluation.

---

## 📌 Overview

The AI Investment Research Agent bridges the gap between raw financial data and human-readable investment insights. By orchestrating multiple external financial data providers and leveraging Large Language Models (LLMs), the system synthesizes complex market signals into a structured recommendation matrix: **INVEST**, **PASS**, or **WATCHLIST**.

**Core Capabilities:**
- **Multi-Source Data Ingestion:** Real-time aggregation of financial fundamentals and market news.
- **LLM-Driven Reasoning:** Context-aware analysis of financial health, recent events, and market position using Google's Gemini API.
- **Fault-Tolerant Execution:** Resilient backend architecture that provides partial analysis even when third-party data sources experience degradation or hit rate limits.
- **Responsive UI:** A sleek, modern Dark Mode React interface designed for fast, professional data consumption.

---

## 🏗️ System Architecture

The application is built on a decoupled, three-tier architecture, ensuring a clear separation of concerns between presentation, orchestration, and external integrations.

### Component Breakdown

1. **Presentation Layer (Frontend)**
   - **Tech:** React (Vite), Tailwind CSS, Recharts
   - **Role:** A lightweight client-side application responsible for state management, user input capture, and dynamic rendering of the AI's structured JSON output into a readable, modular dashboard.

2. **Orchestration Layer (Backend API Gateway)**
   - **Tech:** Node.js, Express.js
   - **Role:** Acts as the central nervous system. It exposes RESTful endpoints to the client, proxying requests to protect API keys, and manages the concurrent fetching and normalization of third-party data.

3. **Data Ingestion Layer (External APIs)**
   - **Tech:** Finnhub (Fundamentals), Alpha Vantage (Price Action), NewsAPI (Sentiment)
   - **Role:** Provides the raw, real-time market telemetry required for accurate analysis.

4. **Cognitive Layer (AI Inference)**
   - **Tech:** Google Gemini API (`@google/generative-ai`), LangChain
   - **Role:** The reasoning engine. It processes the aggregated, normalized financial payload alongside a strict system prompt to generate the final investment thesis and structured UI data.

### High-Level Architecture Diagram

```text
[ React Client ] 
       │ 
       ▼ (HTTP POST /api/research)
[ Express Backend (Node.js) ] ─── (System Prompt + Merged Data) ──▶ [ Google Gemini API ]
       │                                                                  │
       ├──▶ [ Finnhub API ] (Company Profile/Metrics)                     │
       ├──▶ [ Alpha Vantage API ] (Market Data)                           │
       └──▶ [ NewsAPI ] (Market Sentiment)                                ▼
                                                                 (Structured JSON Output)
                                                                          │
[ React Client ] ◀────────────────────────────────────────────────────────┘
```

---

## 🧠 How It Works: Data Flow & Approach

1. **Request Initiation:** The user submits a stock ticker (e.g., `AAPL`) via the React client.
2. **Concurrent Data Ingestion:** The Express backend receives the payload and triggers a `Promise.all` execution matrix, simultaneously querying Finnhub, Alpha Vantage, and NewsAPI.
3. **Data Synthesis:** The backend normalizes the disparate API responses into a unified JSON payload, filtering out unnecessary metadata to optimize token usage for the LLM.
4. **AI Inference:** The normalized payload is injected into a highly specific system prompt (via LangChain) and sent to the Gemini API. The prompt mandates a strict JSON schema response, forcing the LLM to output predictable, parseable data.
5. **Delivery & Rendering:** The backend merges the AI's structured verdict with the raw API data and forwards it back to the client, where React dynamically renders the investment thesis, historical charts, risk factors, and confidence score.

---

## 🚀 How to Run It Locally

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- API Keys for the following services:
  - [Google Gemini (AI Studio)](https://aistudio.google.com/)
  - [Finnhub](https://finnhub.io/)
  - [Alpha Vantage](https://www.alphavantage.co/)
  - [NewsAPI](https://newsapi.org/)

### 1. Environment Configuration

Navigate to the `backend/` directory and create a `.env` file based on the provided template:

```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
FINNHUB_API_KEY=your_finnhub_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
NEWS_API_KEY=your_news_api_key_here
```

### 2. Local Development Setup

You will need to run the backend orchestration server and the frontend client concurrently.

**Start the Backend:**

```bash
cd backend
npm install
npm start
# The REST API will be available at http://localhost:5001
```

**Start the Frontend:**

```bash
cd frontend
npm install
npm run dev
# The UI will be available at http://localhost:5173
```

---

## ⚖️ Key Decisions & Trade-Offs

As an architect, building an MVP requires balancing feature completeness against latency, complexity, and resource constraints.

- **Concurrent API Fetching (`Promise.all`):** 
  - *Decision:* Fetched third-party data in parallel rather than sequentially.
  - *Trade-off:* Maximizes network utilization and drastically reduces latency (bound only by the slowest API). The trade-off is higher immediate memory consumption and the risk of cascading failures if not handled correctly.

- **Fault-Tolerant Degradation:** 
  - *Decision:* Implemented isolated `.catch()` blocks on individual API fetch promises.
  - *Trade-off:* If an API (like NewsAPI) rate-limits or times out, the system injects a `null` or `error` object for that specific node rather than crashing the entire request. The LLM is explicitly instructed to reason around missing data. This prioritizes system availability over strict data completeness.

- **Stateless Architecture (No Database):**
  - *Decision:* The system operates entirely in memory per request; no relational or NoSQL database was implemented.
  - *Trade-off:* Accelerates MVP development and simplifies deployment. However, it prevents us from tracking user history, saving analyses, or implementing persistent caching without external services like Redis.

- **Vite vs. Create React App (CRA):**
  - *Decision:* Utilized Vite for the React build tooling.
  - *Trade-off:* CRA is largely deprecated in the modern frontend ecosystem. Vite provides significantly faster HMR (Hot Module Replacement) and optimized production builds.

---

## 📊 Example Runs

Here is how the AI Investment Agent synthesizes data for vastly different market profiles:

### Case 1: Apple Inc. (`AAPL`) - The Blue Chip
- **Status:** `INVEST` (or `WATCHLIST` depending on current valuation multiples)
- **Confidence Score:** High
- **AI Verdict:** Recognizes strong cash flow, robust hardware/services ecosystem, and recent AI-driven product announcements. The agent successfully identifies AAPL as a low-volatility, foundational portfolio asset, though it may flag high P/E ratios as a risk factor requiring a watchlist approach for value investors.

### Case 2: WeWork (`WE`) - The Distressed Asset
- **Status:** `PASS`
- **Confidence Score:** Very High
- **AI Verdict:** The LLM successfully correlates atrocious financial health metrics (negative operating margins, massive debt load) with overwhelmingly negative news sentiment (bankruptcy filings, restructuring). The agent strictly advises against capital allocation, citing existential corporate risk.

---

## 🛠️ What I Would Improve With More Time (Roadmap)

To elevate this application from an MVP to an enterprise-grade production system, I would implement the following architectural enhancements:

1. **Distributed Caching (Redis):** Implement a Redis caching layer for the financial API responses (e.g., cache news for 1 hour, stock profiles for 24 hours). This would drastically reduce external API calls, bypass rate limits, and cut latency for commonly searched tickers.
2. **Streaming Responses (Server-Sent Events / WebSockets):** The current model requires the user to wait for the entire LLM generation to complete. Implementing SSE would allow the AI's thought process and verdict to stream onto the screen token-by-token, vastly improving perceived performance and UX.
3. **Comprehensive Test Coverage:** Integrate `Jest` and `Supertest` for backend API mocking and integration testing, alongside `React Testing Library` to ensure UI state transitions (loading -> error/success) behave predictably.
4. **Containerization & CI/CD:** Write `Dockerfiles` for both the frontend and backend, orchestrated via `docker-compose`. I would also implement GitHub Actions to run automated checks and testing before deployment.
