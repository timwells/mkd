import axios from 'axios'
import { SMA } from 'technicalindicators'
import { PAYLOAD_BODY, HOST, SERIES_PATH, tickerMap } from './ft-constants.js'
import { findSymbolId } from './ft-web.js'

const alignSMA = (series, smaValues, period) => {
  const padding = new Array(period - 1).fill(null)
  return series.map((point, i) => ({
    time: point.time,
    value: i < period - 1 ? null : Number(smaValues[i - (period - 1)].toFixed(3)),
  }))
}

export const getHistoricalSeries2 = async (ticker, mas) => {
  // Parse requested MAs: "50,100,200" → ['MA50', 'MA100', 'MA200']
  console.log('Requested Ticker, MAs:', ticker, mas)
  let requestedMAs = mas
    ? mas
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((n) => `MA${n}`)
    : []

  try {
    let result = await getHistoricalSeries(ticker)
    if (!result || !result.data || result.data.length === 0) {
      throw new Error('No data found for ticker ' + ticker)
    }

    // Dynamically calculate only requested MAs
    for (const maKey of requestedMAs) {
      const match = maKey.match(/^MA(\d+)$/)
      if (!match) continue

      const period = Number(match[1])
      if (period < 2 || period > result.data.length) continue

      const smaValues = SMA.calculate({ period, values: result.data.map((d) => d.value) })
      if (smaValues.length === 0) continue

      result[maKey] = {
        data: alignSMA(result.data, smaValues, period),
      }
    }

    return result
  } catch (error) {
    console.error(`[getHistoricalSeries2] Failed ${ticker}:`, error.message)
    return {
      name: ticker,
      ticker: ticker,
      data: [],
      error: error.message || 'Unknown error',
    }
  }
}

export const getHistoricalSeries = async (ticker) => {
  let result = tickerMap.get(ticker)

  if (result == null) {
    result = await findSymbolId(ticker)
  }

  let dataObj = null
  if (result) {
    let payLoad = PAYLOAD_BODY
    payLoad.elements[0].Symbol = result.xid
    try {
      const { data } = await axios.post(`${HOST}${SERIES_PATH}`, payLoad)
      let dv = []
      for (let i = 0; i < data.Dates.length; i++) {
        dv.push({
          time: data.Dates[i].split('T')[0],
          value: data.Elements[0].ComponentSeries[data.Elements[0].ComponentSeries.length - 1].Values[i],
        })
      }
      dataObj = {
        name: data.Elements[0].CompanyName,
        ticker: ticker,
        data: dv,
      }
      return dataObj
    } catch (e) {
      console.log(e.error)
    }
  }
  return dataObj
}

export const lookUpSymbol = async (ticker) => {
  return await findSymbolId(ticker)
}

export const lookUpSymbol2 = async (ticker) => {
  return tickerMap.get(ticker)
}
