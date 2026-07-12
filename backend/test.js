const axios = require('axios');
const test = async () => {
  const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=9GAL5TNPT9A328CX`);
  console.log(Object.keys(response.data));
}
test();
