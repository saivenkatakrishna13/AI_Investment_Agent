const axios = require('axios');

const getCompanyOverview = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error('Alpha Vantage API key is missing');

  try {
    const response = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`);
    return response.data;
  } catch (error) {
    throw new Error(`Alpha Vantage API Error: ${error.message}`);
  }
};
const getHistoricalPrices = async (symbol) => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error('Alpha Vantage API key is missing');

  try {
    const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
    return response.data;
  } catch (error) {
    throw new Error(`Alpha Vantage API Error: ${error.message}`);
  }
};

module.exports = { getCompanyOverview, getHistoricalPrices };
