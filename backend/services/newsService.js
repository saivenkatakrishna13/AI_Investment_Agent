const axios = require('axios');

const getLatestNews = async (query) => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error('NewsAPI key is missing');

  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${encodedQuery}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`,
      {
        timeout: 10000,
        headers: { 'User-Agent': 'InvestIQ/1.0' }
      }
    );
    return response.data?.articles || [];
  } catch (error) {
    throw new Error(`NewsAPI Error: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = { getLatestNews };
