const express = require('express');
const router = express.Router();
const finnhubService = require('../services/finnhubService');
const alphaVantageService = require('../services/alphaVantageService');
const newsService = require('../services/newsService');
const geminiService = require('../services/geminiService');

router.post('/research', async (req, res) => {
  const { company } = req.body;

  if (!company) {
    return res.status(400).json({ error: 'Company name or ticker is required' });
  }

  try {
    console.log(`Starting research for: ${company}`);
    
    // Fetch data in parallel where possible
    const [finnhubData, alphaVantageData, newsData, historicalPrices] = await Promise.all([
      finnhubService.getCompanyData(company).catch(e => {
        console.error('Finnhub error:', e.message);
        return { error: 'Failed to fetch Finnhub data', details: e.message };
      }),
      alphaVantageService.getCompanyOverview(company).catch(e => {
        console.error('AlphaVantage error:', e.message);
        return { error: 'Failed to fetch Alpha Vantage data', details: e.message };
      }),
      newsService.getLatestNews(company).catch(e => {
        console.error('NewsAPI error:', e.message);
        return { error: 'Failed to fetch news', details: e.message };
      }),
      alphaVantageService.getHistoricalPrices(company).catch(e => {
        console.error('AlphaVantage history error:', e.message);
        return { error: 'Failed to fetch history', details: e.message };
      })
    ]);

    // Format Financial Metrics from APIs directly
    const formatValue = (val) => val && val !== 'None' ? val : null;
    const formatBillion = (val) => {
      const num = parseInt(val);
      if (isNaN(num)) return null;
      return `$${(num / 1e9).toFixed(2)}B`;
    };

    const financialMetrics = {
      marketCap: formatBillion(alphaVantageData?.MarketCapitalization) || 'N/A',
      peRatio: formatValue(alphaVantageData?.PERatio) || 'N/A',
      eps: formatValue(alphaVantageData?.EPS) || 'N/A',
      revenue: formatBillion(alphaVantageData?.RevenueTTM) || 'N/A',
      profitMargin: formatValue(alphaVantageData?.ProfitMargin) ? `${(parseFloat(alphaVantageData.ProfitMargin) * 100).toFixed(2)}%` : 'N/A',
      currentPrice: finnhubData?.quote?.c ? `$${finnhubData.quote.c}` : 'N/A',
      dailyChange: finnhubData?.quote?.dp ? `${finnhubData.quote.dp > 0 ? '+' : ''}${finnhubData.quote.dp.toFixed(2)}%` : 'N/A'
    };

    // Format historical data for recharts (last 6 months = ~126 trading days)
    let historicalData = [];
    console.log('historicalPrices keys:', Object.keys(historicalPrices || {}));
    if (historicalPrices && historicalPrices['Information']) {
       console.log('Alpha Vantage Rate Limit Hit:', historicalPrices['Information']);
    }
    if (historicalPrices && historicalPrices['Time Series (Daily)']) {
      const dates = Object.keys(historicalPrices['Time Series (Daily)']).slice(0, 126).reverse();
      historicalData = dates.map(date => ({
        date,
        price: parseFloat(historicalPrices['Time Series (Daily)'][date]['4. close'])
      }));
    }

    const combinedData = {
      company,
      fundamentals: financialMetrics,
      news: newsData
    };

    console.log(`Data collected for ${company}, sending to Gemini for analysis...`);

    const analysis = await geminiService.analyzeCompany(combinedData);

    // Merge API data with Gemini analysis
    res.json({
      ...analysis,
      financialMetrics,
      historicalData,
      newsData
    });

  } catch (error) {
    console.error('Error during research process:', error);
    res.status(500).json({ error: 'An error occurred during the research process', details: error.message });
  }
});

module.exports = router;
