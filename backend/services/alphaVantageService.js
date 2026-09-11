const axios = require('axios');

const axiosConfig = {
  timeout: 10000,
  headers: { 'User-Agent': 'InvestIQ/1.0' }
};

const checkRateLimit = (data) => {
  if (!data || typeof data !== 'object') return null;
  if (data.Information) return data.Information;
  if (data.Note) return data.Note;
  return null;
};

const getCompanyOverview = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error('Alpha Vantage API key is missing');

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`,
      axiosConfig
    );
    const rateLimit = checkRateLimit(response.data);
    if (rateLimit) {
      return { isRateLimited: true, reason: rateLimit };
    }
    return response.data || {};
  } catch (error) {
    throw new Error(`Alpha Vantage API Error: ${error.message}`);
  }
};

const getGlobalQuote = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error('Alpha Vantage API key is missing');

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
      axiosConfig
    );
    const rateLimit = checkRateLimit(response.data);
    if (rateLimit) {
      return { isRateLimited: true, reason: rateLimit };
    }
    return response.data?.['Global Quote'] || {};
  } catch (error) {
    console.warn(`Alpha Vantage Global Quote error for ${symbol}:`, error.message);
    return {};
  }
};

const getHistoricalPrices = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error('Alpha Vantage API key is missing');

  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`,
      axiosConfig
    );
    const rateLimit = checkRateLimit(response.data);
    if (rateLimit) {
      return { isRateLimited: true, reason: rateLimit };
    }
    return response.data || {};
  } catch (error) {
    throw new Error(`Alpha Vantage API Error: ${error.message}`);
  }
};

module.exports = { getCompanyOverview, getGlobalQuote, getHistoricalPrices };
