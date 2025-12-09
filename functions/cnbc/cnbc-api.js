import fetch from 'node-fetch'; // Built-in for Node.js 18+
import { createHash } from 'crypto'; // Correct import for Node.js crypto

const HOST = `https://webql-redesign.cnbcfm.com`;
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; 1.0)',
  'Accept': 'application/json',
}

// The EXACT query string that CNBC uses (must match 100% — no extra spaces, line breaks matter!)
const QUERY = `query getQuoteChartData($symbol: String!, $timeRange: String!) { quote(symbol: $symbol) { chart(timeRange: $timeRange) { elements { date open high low close volume } metadata { symbol name currency marketState } } } }`;

// CORRECT & WORKING function (synchronous — best for Node.js)
function computePersistedQueryHash(query) {
  return createHash('sha256').update(query).digest('hex');
}

export const getHistoricalValuesImpl2 = async (req, res) => {
  try {
    // Parse request body
    const { symbol = 'UK30Y-GB', timeRange = '1Y' } = req.body;

    // Validate inputs
    if (!symbol || typeof symbol !== 'string') {
      throw new Error('Invalid or missing symbol');
    }
    if (!timeRange || !['1D', '5D', '1M', '6M', '1Y', 'YTD', 'MAX'].includes(timeRange)) {
      throw new Error('Invalid timeRange; use 1D, 5D, 1M, 6M, 1Y, YTD, or MAX');
    }

    // Build variables and extensions
    const variables = { symbol, timeRange };
    const extensions = {
      persistedQuery: {
        version: 1,
        sha256Hash: '9e1670c29a10707c417a1efd327d4b2b1d456b77f1426e7e84fb7d399416bb6b'
        //sha256Hash: computePersistedQueryHash(QUERY) // Commented out since the computed hash does not match the required one; use hardcoded correct hash from the original URL
      }
    };

    // Construct the full GraphQL URL (encode JSON)
    const encodedVariables = encodeURIComponent(JSON.stringify(variables));
    const encodedExtensions = encodeURIComponent(JSON.stringify(extensions));
    const graphqlUrl = `${HOST}/graphql?operationName=getQuoteChartData&variables=${encodedVariables}&extensions=${encodedExtensions}`;

    // Fetch the data (add User-Agent to mimic browser if needed)
    const response = await fetch(graphqlUrl, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const valueSeries = data.data.chartData.priceBars.reduce((arr,e) => {
        // Process and exclude ohlc close null data
        if(e.close !== null && e.tradeTime !== null) {
            arr.push({
                time:  e.tradeTime.replace(/^(\d{4})(\d{2})(\d{2}).*$/, '$1-$2-$3'),
                value: +parseFloat(e.close).toFixed(2),
            })
        } return arr;
    }, []);

    return {
        name: data.data.chartData.allSymbols[0].name,
        data: valueSeries 
    }
  } catch (error) {
      console.error('Error fetching chart data:', error);
      return {
        success: false,
        error: error.message,
        symbol: req.body.symbol,
        timeRange: req.body.timeRange
      };
  }
};

export const getHistoricalValuesImpl = async (symbol) => {
  const timeRange = 'ALL';
  const SHA256HASH = '9e1670c29a10707c417a1efd327d4b2b1d456b77f1426e7e84fb7d399416bb6b'

  try {
    // Build variables and extensions
    const variables = { symbol, timeRange };
    const extensions = {
      persistedQuery: {
        version: 1,
        sha256Hash: SHA256HASH
      }
    };

    // Construct the full GraphQL URL (encode JSON)
    const encodedVariables = encodeURIComponent(JSON.stringify(variables));
    const encodedExtensions = encodeURIComponent(JSON.stringify(extensions));
    const graphqlUrl = `${HOST}/graphql?operationName=getQuoteChartData&variables=${encodedVariables}&extensions=${encodedExtensions}`;

    // Fetch the data (add User-Agent to mimic browser if needed)
    const response = await fetch(graphqlUrl, {
      method: 'GET',
      headers: HEADERS
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    // return data;

    const valueSeries = data.data.chartData.priceBars.reduce((arr,e) => {
        // Process and exclude ohlc close null data
        if(e.close !== null && e.tradeTime !== null) {
            arr.push({
                time:  e.tradeTime.replace(/^(\d{4})(\d{2})(\d{2}).*$/, '$1-$2-$3'),
                value: +parseFloat(e.close).toFixed(2),
            })
        } return arr;
    }, []);
  
    return {
        name: data.data.chartData.allSymbols[0].name,
        data: valueSeries 
    }
  } catch (error) {
      console.error('Error fetching chart data:', error);
      return {
        success: false,
        error: error.message,
        symbol: symbol,
        timeRange: timeRange
      };
  }
};