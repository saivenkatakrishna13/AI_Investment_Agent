const dotenv = require('dotenv');
dotenv.config();

const finnhubService = require('./services/finnhubService');
const alphaVantageService = require('./services/alphaVantageService');
const newsService = require('./services/newsService');

async function debug() {
  const symbol = 'TCS.BSE'; // test with TCS.BSE
  
  console.log('Testing Finnhub for', symbol);
  try {
    const finn = await finnhubService.getCompanyData(symbol);
    console.log('Finnhub Data:', JSON.stringify(finn).substring(0, 200));
  } catch (e) {
    console.error('Finnhub Error:', e.message);
  }

  console.log('\nTesting Alpha Vantage for', symbol);
  try {
    const alpha = await alphaVantageService.getCompanyOverview(symbol);
    console.log('Alpha Vantage Data:', JSON.stringify(alpha).substring(0, 200));
  } catch (e) {
    console.error('Alpha Vantage Error:', e.message);
  }

  console.log('\nTesting NewsAPI for', symbol);
  try {
    const news = await newsService.getLatestNews(symbol);
    console.log('NewsAPI Data count:', news.length);
  } catch (e) {
    console.error('NewsAPI Error:', e.message);
  }
}

debug();
