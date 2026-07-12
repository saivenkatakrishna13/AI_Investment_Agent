const axios = require('axios');

const getCompanyData = async (symbol) => {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error('Finnhub API key is missing');

  const today = new Date();
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const toDate = today.toISOString().split('T')[0];
  const fromDate = lastWeek.toISOString().split('T')[0];

  try {
    const [profileRes, quoteRes, newsRes] = await Promise.all([
      axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`).catch(() => ({ data: {} })),
      axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`).catch(() => ({ data: {} })),
      axios.get(`https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`).catch(() => ({ data: [] }))
    ]);

    return {
      profile: profileRes.data,
      quote: quoteRes.data,
      news: newsRes.data.slice(0, 5) // top 5 recent news from finnhub
    };
  } catch (error) {
    throw new Error(`Finnhub API Error: ${error.response?.data?.error || error.message}`);
  }
};

module.exports = { getCompanyData };
