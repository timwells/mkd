import axios from 'axios'
import { SMA } from 'technicalindicators'

const CNN_FEAR_AND_GREED = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata'
const HEADERS = {
  'Accept-Encoding': 'gzip, compress, deflate, br',
  Accept: '*/*',
  Connection: 'keep-alive',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  'Cache-Control': 'no-cache',
}

const JMB_FEAR_AND_GREED = 'https://cdn.jmbullion.com/fearandgreed/fearandgreed.json'

const goldSentiment = async () => {
  let { data } = await axios.get(JMB_FEAR_AND_GREED)
  return {
    data: Object.entries(data).map(([date, value]) => [
      new Date(date).getTime(), // timestamp in milliseconds
      value
    ])    
  }
}

const buildTASeries = (series, sma) => {
  let smaTimeValue = []
  let j = 0
  for (let i = series.length - sma.length; i < series.length; i++, j++) {
    smaTimeValue.push([series[i].x, +sma[j].toFixed(2)])
  }
  return smaTimeValue
}

export const marketSentiment = async () => {
  try {
    let { data } = await axios.get(CNN_FEAR_AND_GREED, { headers: HEADERS })

    data.fear_and_greed.score = +data.fear_and_greed.score.toFixed(2)
    data.fear_and_greed.previous_close = +data.fear_and_greed.previous_close.toFixed(2)
    data.fear_and_greed.previous_1_week = +data.fear_and_greed.previous_1_week.toFixed(2)
    data.fear_and_greed.previous_1_month = +data.fear_and_greed.previous_1_month.toFixed(2)
    data.fear_and_greed.previous_1_year = +data.fear_and_greed.previous_1_year.toFixed(2)

    // Combine F&G date-time and values
    data.fear_and_greed_historical.data = data.fear_and_greed_historical.data.map((e) => {
      const d = new Date(e.x) // parse original x
      d.setUTCHours(0, 0, 0, 0) // set time to midnight UTC
      const ts = d.getTime() // get Unix timestamp in milliseconds
      return [ts, +e.y.toFixed(2)]
    })

    // Combine Vix date-time and values
    data.market_volatility_vix.data = data.market_volatility_vix.data.map((e) => [e.x, +e.y.toFixed(2)])

    // Calculate 200 day moving average
    const series = data.market_momentum_sp500.data.map((e) => +e.y.toFixed(0))

    data.market_momentum_sp500_MA200 = {
      data: buildTASeries(data.market_momentum_sp500.data, SMA.calculate({ period: 200, values: series })),
    }
    data.market_momentum_sp500_MA100 = {
      data: buildTASeries(data.market_momentum_sp500.data, SMA.calculate({ period: 100, values: series })),
    }
    data.market_momentum_sp500_MA50 = {
      data: buildTASeries(data.market_momentum_sp500.data, SMA.calculate({ period: 50, values: series })),
    }

    // Combine momentum_sp500 date-time and values
    data.market_momentum_sp500.data = data.market_momentum_sp500.data.map((e) => [e.x, +e.y.toFixed(0)])

    // Combine stock_price_strength date-time and values
    data.stock_price_strength.data = data.stock_price_strength.data.map((e) => [e.x, +e.y.toFixed(2)])

    delete data.market_momentum_sp125
    delete data.safe_haven_demand
    delete data.junk_bond_demand
    delete data.stock_price_breadth
    delete data.put_call_options
    delete data.market_volatility_vix_50

    // Gold Fear and Greed
    data.gold_fear_and_greed = await goldSentiment()

    return data;

  } catch (e) {
    console.log(e.message)
  }
  return null
}
