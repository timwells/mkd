import axios from 'axios'
import { load } from 'cheerio'
import { SMA } from 'technicalindicators'

const MULTPL_HOST = 'https://www.multpl.com'
const MULTPL_POST_FIX = 'table/by-month'

const alignSMA = (series, smaValues, period) => {
  const padding = new Array(period - 1).fill(null)

  return series.map((point, i) => ({
    time: point.time,
    value: i < period - 1 ? null : Number(smaValues[i - (period - 1)].toFixed(3))
  }))
}

/**
 * Fetch and enrich dataset with requested moving averages
 * Usage: datasetImpl('shiller-pe', '50,100,200') or datasetImpl('cape', '10,50')
 */
export const datasetImpl = async (ds, mas) => {
  const url = `${MULTPL_HOST}/${ds}/${MULTPL_POST_FIX}`

  // Parse requested MAs: "50,100,200" → ['MA50', 'MA100', 'MA200']
  let requestedMAs = mas ? mas.split(',')
                                  .map(s => s.trim())
                                    .filter(Boolean)
                                      .map(n => `MA${n}`)
                            : []

  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MarketData/1.0)' }
    })

    const $ = load(data)
    const $table = $('#datatable')
    if (!$table.length) throw new Error('Table #datatable not found')

    let  rows = []

    $table.find('tr').each((_i, row) => {
      const cols = $(row).find('td').map((_, el) => $(el).text().trim()).get()
      if (cols.length < 2) return

      const date = new Date(cols[0])
      if (isNaN(date.getTime())) return
      if (date < new Date('1990-01-01')) return

      const value = parseFloat(cols[1].replace(/[%†,]/g, ''))
      if (isNaN(value)) return

      rows.push({
        time: date.toISOString().split('T')[0],
        value: Number(value.toFixed(3)),
      })
    })

    if (rows.length === 0) throw new Error('No valid data')

    rows.sort((a, b) => a.time.localeCompare(b.time))
    const values = rows.map(r => r.value)

    let result = {
      name: ds,
      ticker: ds,
      data: rows,
    }

    // Dynamically calculate only requested MAs
    for (const maKey of requestedMAs) {
      const match = maKey.match(/^MA(\d+)$/)
      if (!match) continue

      const period = Number(match[1])
      if (period < 2 || period > values.length) continue

      const smaValues = SMA.calculate({ period, values })
      if (smaValues.length === 0) continue

      result[maKey] = {
        data: alignSMA(rows, smaValues, period)
      }
    }
    return result

  } catch (error) {

    console.error(`[datasetImpl] Failed ${ds}:`, error.message)
    return {
      name: ds,
      ticker: ds,
      data: [],
      error: error.message || 'Unknown error'
    }
  }
}
