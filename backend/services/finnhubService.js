const axios = require('axios');

const getCompanyData = async (symbol) => {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error('Finnhub API key is missing');

  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const toDate = today.toISOString().split('T')[0];
  const fromDate = lastWeek.toISOString().split('T')[0];

  const axiosConfig = {
    timeout: 10000,
    headers: { 'User-Agent': 'InvestIQ/1.0' }
  };

  try {
    const [profileRes, quoteRes, metricRes, newsRes] = await Promise.all([
      axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`, axiosConfig).catch(err => {
        console.warn(`Finnhub profile error for ${symbol}:`, err.message);
        return { data: {} };
      }),
      axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`, axiosConfig).catch(err => {
        console.warn(`Finnhub quote error for ${symbol}:`, err.message);
        return { data: {} };
      }),
      axios.get(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`, axiosConfig).catch(err => {
        console.warn(`Finnhub metric error for ${symbol}:`, err.message);
        return { data: {} };
      }),
      axios.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`, axiosConfig).catch(err => {
        console.warn(`Finnhub news error for ${symbol}:`, err.message);
        return { data: [] };
      })
    ]);

    return {
      profile: profileRes.data || {},
      quote: quoteRes.data || {},
      metric: metricRes.data?.metric || {},
      news: Array.isArray(newsRes.data) ? newsRes.data.slice(0, 5) : []
    };
  } catch (error) {
    throw new Error(`Finnhub API Error: ${error.response?.data?.error || error.message}`);
  }
};

const searchSymbols = async (query) => {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey || !query || !query.trim()) return [];

  const executeSearch = async (searchTerm) => {
    try {
      const res = await axios.get('https://finnhub.io/api/v1/search', {
        params: { q: searchTerm, token: apiKey },
        timeout: 8000
      });
      return res.data?.result || [];
    } catch (err) {
      if (err.response?.status === 422) {
        return null; // Signals 'q too long' or format issue
      }
      console.warn(`Finnhub symbol search error for "${searchTerm}":`, err.message);
      return [];
    }
  };

  const rawQuery = query.trim();
  let results = await executeSearch(rawQuery);

  // If search failed with 422 or yielded no results, sanitize corporate suffixes and retry
  if (results === null || results.length === 0) {
    const cleaned = rawQuery
      .replace(/[,.]/g, ' ')
      .replace(/\b(Corporation|Corp\.?|Incorporated|Inc\.?|Company|Co\.?|Limited|Ltd\.?|LLC|PLC|Services)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned && cleaned.toLowerCase() !== rawQuery.toLowerCase()) {
      const retryResults = await executeSearch(cleaned);
      if (Array.isArray(retryResults) && retryResults.length > 0) {
        results = retryResults;
      }
    }
  }

  if (!Array.isArray(results) || results.length === 0) {
    return [];
  }

  return results
    .filter(item => item.symbol && typeof item.symbol === 'string')
    .slice(0, 6)
    .map(item => ({
      symbol: item.symbol,
      displaySymbol: item.displaySymbol || item.symbol,
      description: item.description || item.symbol,
      type: item.type || 'Common Stock'
    }));
};

module.exports = { getCompanyData, searchSymbols };

