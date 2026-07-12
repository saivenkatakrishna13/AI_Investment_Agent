const axios = require('axios');

const getLatestNews = async (query) => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error('NewsAPI key is missing');

  try {
    const response = await axios.get(`https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`);
    return response.data.articles || [];
  } catch (error) {
    throw new Error(`NewsAPI Error: ${error.response?.data?.message || error.message}`);
  }
};

module.exports = { getLatestNews };
