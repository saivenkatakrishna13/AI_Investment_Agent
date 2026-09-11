const express = require('express');
const router = express.Router();
const finnhubService = require('../services/finnhubService');
const alphaVantageService = require('../services/alphaVantageService');
const newsService = require('../services/newsService');
const nvidiaService = require('../services/nvidiaService');

// Helper to format market capitalization from either raw dollars or millions
const formatMarketCap = (val, unit = 'dollars') => {
  if (val === undefined || val === null || val === 'None' || val === '') return 'Unavailable';
  let num = parseFloat(val);
  if (isNaN(num) || num <= 0) return 'Unavailable';

  // If unit is 'millions' (from Finnhub profile.marketCapitalization)
  if (unit === 'millions') {
    num = num * 1e6;
  }

  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)}T`;
  } else if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  return `$${num.toLocaleString()}`;
};

// Autocomplete search endpoint
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query || !query.trim()) {
    return res.json([]);
  }
  try {
    const results = await finnhubService.searchSymbols(query);
    res.json(results);
  } catch (err) {
    console.error('Search route error:', err.message);
    res.json([]);
  }
});

router.post('/research', async (req, res) => {
  const { company } = req.body;

  if (!company || !company.trim()) {
    return res.status(400).json({ error: 'Company name or ticker is required' });
  }

  try {
    const rawInput = company.trim();
    let ticker = rawInput.toUpperCase();
    let companyDisplayName = rawInput;

    const directAliases = {
      'APPLE': 'AAPL',
      'APPLE INC': 'AAPL',
      'APPLE INC.': 'AAPL',
      'MICROSOFT': 'MSFT',
      'MICROSOFT CORP': 'MSFT',
      'MICROSOFT CORPORATION': 'MSFT',
      'GOOGLE': 'GOOGL',
      'ALPHABET': 'GOOGL',
      'ALPHABET INC': 'GOOGL',
      'AMAZON': 'AMZN',
      'AMAZON.COM': 'AMZN',
      'AMAZON.COM INC': 'AMZN',
      'TESLA': 'TSLA',
      'TESLA INC': 'TSLA',
      'TESLA, INC.': 'TSLA',
      'NVIDIA': 'NVDA',
      'NVIDIA CORP': 'NVDA',
      'NVIDIA CORPORATION': 'NVDA',
      'META': 'META',
      'FACEBOOK': 'META',
      'NETFLIX': 'NFLX',
      'TCS': 'TCS.NS'
    };

    if (directAliases[ticker]) {
      ticker = directAliases[ticker];
    } else if (!/^[A-Z]{1,5}(\.[A-Z]{1,3})?$/.test(ticker)) {
      try {
        const searchRes = await finnhubService.searchSymbols(rawInput);
        if (searchRes && searchRes.length > 0) {
          ticker = searchRes[0].symbol;
          if (searchRes[0].description) {
            companyDisplayName = searchRes[0].description;
          }
        }
      } catch (lookupErr) {
        console.warn('Could not resolve company name to ticker, using raw query:', rawInput);
      }
    }

    console.log(`Starting research for: ${rawInput} (resolved ticker: ${ticker})`);

    // Fetch data in parallel with resilient multi-provider fallbacks
    const [finnhubData, alphaVantageOverview, alphaVantageQuote, newsData, historicalPrices] = await Promise.all([
      finnhubService.getCompanyData(ticker).catch(e => {
        console.warn('Finnhub getCompanyData error:', e.message);
        return { profile: {}, quote: {}, metric: {}, news: [] };
      }),
      alphaVantageService.getCompanyOverview(ticker).catch(e => {
        console.warn('AlphaVantage overview error:', e.message);
        return {};
      }),
      alphaVantageService.getGlobalQuote(ticker).catch(e => {
        console.warn('AlphaVantage global quote error:', e.message);
        return {};
      }),
      newsService.getLatestNews(companyDisplayName || ticker).catch(e => {
        console.warn('NewsAPI error:', e.message);
        return [];
      }),
      alphaVantageService.getHistoricalPrices(ticker).catch(e => {
        console.warn('AlphaVantage historical error:', e.message);
        return {};
      })
    ]);

    // 1. Resolve Best Quote Data (Finnhub primary, Alpha Vantage fallback)
    const finnQuote = finnhubData?.quote || {};
    const avQuote = alphaVantageQuote || {};

    let currentPrice = 'Unavailable';
    let dailyChange = 'Unavailable';
    let dailyChangePercent = 'Unavailable';
    let previousClose = 'Unavailable';
    let high = 'Unavailable';
    let low = 'Unavailable';
    let open = 'Unavailable';

    if (typeof finnQuote.c === 'number' && finnQuote.c > 0) {
      currentPrice = `$${finnQuote.c.toFixed(2)}`;
      const d = finnQuote.d || 0;
      const dp = finnQuote.dp || 0;
      dailyChange = `${d >= 0 ? '+' : ''}$${Math.abs(d).toFixed(2)}`;
      dailyChangePercent = `${dp >= 0 ? '+' : ''}${dp.toFixed(2)}%`;
      if (typeof finnQuote.pc === 'number' && finnQuote.pc > 0) previousClose = `$${finnQuote.pc.toFixed(2)}`;
      if (typeof finnQuote.h === 'number' && finnQuote.h > 0) high = `$${finnQuote.h.toFixed(2)}`;
      if (typeof finnQuote.l === 'number' && finnQuote.l > 0) low = `$${finnQuote.l.toFixed(2)}`;
      if (typeof finnQuote.o === 'number' && finnQuote.o > 0) open = `$${finnQuote.o.toFixed(2)}`;
    } else if (avQuote['05. price'] && parseFloat(avQuote['05. price']) > 0) {
      const p = parseFloat(avQuote['05. price']);
      const c = parseFloat(avQuote['09. change'] || 0);
      const cp = parseFloat((avQuote['10. change percent'] || '0').replace('%', ''));
      currentPrice = `$${p.toFixed(2)}`;
      dailyChange = `${c >= 0 ? '+' : ''}$${Math.abs(c).toFixed(2)}`;
      dailyChangePercent = `${cp >= 0 ? '+' : ''}${cp.toFixed(2)}%`;
      if (avQuote['08. previous close']) previousClose = `$${parseFloat(avQuote['08. previous close']).toFixed(2)}`;
      if (avQuote['03. high']) high = `$${parseFloat(avQuote['03. high']).toFixed(2)}`;
      if (avQuote['04. low']) low = `$${parseFloat(avQuote['04. low']).toFixed(2)}`;
      if (avQuote['02. open']) open = `$${parseFloat(avQuote['02. open']).toFixed(2)}`;
    }

    // 2. Resolve Best Fundamental Valuation Metrics
    let marketCap = 'Unavailable';
    if (alphaVantageOverview?.MarketCapitalization && !alphaVantageOverview.isRateLimited) {
      marketCap = formatMarketCap(alphaVantageOverview.MarketCapitalization, 'dollars');
    } else if (finnhubData?.profile?.marketCapitalization) {
      marketCap = formatMarketCap(finnhubData.profile.marketCapitalization, 'millions');
    } else if (finnhubData?.metric?.marketCapitalization) {
      marketCap = formatMarketCap(finnhubData.metric.marketCapitalization, 'millions');
    }

    let peRatio = 'Unavailable';
    if (alphaVantageOverview?.PERatio && alphaVantageOverview.PERatio !== 'None' && !alphaVantageOverview.isRateLimited) {
      peRatio = parseFloat(alphaVantageOverview.PERatio).toFixed(2);
    } else if (typeof finnhubData?.metric?.peTTM === 'number' && finnhubData.metric.peTTM > 0) {
      peRatio = finnhubData.metric.peTTM.toFixed(2);
    } else if (typeof finnhubData?.metric?.peBasicExclExtraTTM === 'number' && finnhubData.metric.peBasicExclExtraTTM > 0) {
      peRatio = finnhubData.metric.peBasicExclExtraTTM.toFixed(2);
    }

    let eps = 'Unavailable';
    if (alphaVantageOverview?.EPS && alphaVantageOverview.EPS !== 'None' && !alphaVantageOverview.isRateLimited) {
      eps = `$${parseFloat(alphaVantageOverview.EPS).toFixed(2)}`;
    } else if (typeof finnhubData?.metric?.epsTTM === 'number') {
      eps = `$${finnhubData.metric.epsTTM.toFixed(2)}`;
    }

    let revenue = 'Unavailable';
    if (alphaVantageOverview?.RevenueTTM && alphaVantageOverview.RevenueTTM !== 'None' && !alphaVantageOverview.isRateLimited) {
      revenue = formatMarketCap(alphaVantageOverview.RevenueTTM, 'dollars');
    }

    let profitMargin = 'Unavailable';
    if (alphaVantageOverview?.ProfitMargin && alphaVantageOverview.ProfitMargin !== 'None' && !alphaVantageOverview.isRateLimited) {
      profitMargin = `${(parseFloat(alphaVantageOverview.ProfitMargin) * 100).toFixed(2)}%`;
    }

    const financialMetrics = {
      currentPrice,
      dailyChange: dailyChange !== 'Unavailable' && dailyChangePercent !== 'Unavailable' 
        ? `${dailyChange} (${dailyChangePercent})` 
        : dailyChange,
      dailyChangePercent,
      previousClose,
      high,
      low,
      open,
      marketCap,
      peRatio,
      eps,
      revenue,
      profitMargin
    };

    // 3. Format Historical Data & Status
    let historicalData = [];
    let historicalStatus = 'available';
    let historicalReason = null;

    if (historicalPrices?.isRateLimited || historicalPrices?.['Information'] || historicalPrices?.['Note']) {
      historicalStatus = 'rate_limited';
      historicalReason = historicalPrices.reason || historicalPrices['Information'] || historicalPrices['Note'] || 'Alpha Vantage standard free-tier limit (25 req/day) reached.';
      console.log(`Historical limit reached for ${ticker}:`, historicalReason);
    } else if (historicalPrices && historicalPrices['Time Series (Daily)']) {
      const dates = Object.keys(historicalPrices['Time Series (Daily)']).slice(0, 126).reverse();
      historicalData = dates.map(date => ({
        date,
        price: parseFloat(historicalPrices['Time Series (Daily)'][date]['4. close'])
      }));
    } else {
      historicalStatus = 'unavailable';
      historicalReason = 'Historical price data unavailable for this ticker.';
    }

    // 4. News Aggregation & Dynamic Japanese Translation
    let finalNews = [];
    if (Array.isArray(newsData) && newsData.length > 0) {
      finalNews = newsData;
    } else if (Array.isArray(finnhubData?.news) && finnhubData.news.length > 0) {
      finalNews = finnhubData.news.map(n => ({
        title: n.headline,
        description: n.summary,
        url: n.url,
        publishedAt: n.datetime ? new Date(n.datetime * 1000).toISOString() : new Date().toISOString(),
        source: { name: n.source || 'Finnhub' }
      }));
    }

    // Dynamically translate Japanese news articles into English
    finalNews = await nvidiaService.translateJapaneseNews(finalNews);

    const resolvedCompanyName = 
      finnhubData?.profile?.name || 
      alphaVantageOverview?.Name || 
      companyDisplayName || 
      ticker;

    // 5. NVIDIA NIM AI Analysis
    const combinedData = {
      company: ticker,
      companyName: resolvedCompanyName,
      fundamentals: financialMetrics,
      news: finalNews,
      historicalStatus
    };

    console.log(`Sending real data for ${ticker} to NVIDIA NIM (${process.env.NVIDIA_MODEL || 'meta/llama-3.2-11b-vision-instruct'})...`);
    const analysis = await nvidiaService.analyzeCompany(combinedData);

    // 6. Return Structured Unified Response
    res.json({
      company: {
        symbol: ticker,
        name: resolvedCompanyName
      },
      // Backward compatibility top-level properties
      companyName: resolvedCompanyName,
      ticker,
      financialMetrics,
      historicalData,
      historicalStatus,
      historicalReason,
      newsData: finalNews,
      aiAnalysis: analysis,
      decision: analysis.decision,
      confidence: analysis.confidence,
      summary: analysis.summary,
      keyReasons: analysis.keyReasons,
      risks: analysis.risks,
      newsSummary: analysis.newsSummary,
      finalVerdict: analysis.finalVerdict,
      provider: analysis.provider
    });

  } catch (error) {
    console.error('Error during research process:', error);
    res.status(500).json({ error: 'An error occurred during the research process', details: error.message });
  }
});

module.exports = router;
