// index.js
import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'

const TVC_BASE = 'https://tvc4.investing.com'

// Reuse client across invocations (huge performance win in Cloud Functions)
let client = null

const createClient = () => {
  const jar = new CookieJar()
  return wrapper(
    axios.create({
      jar,
      timeout: 20000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: 'https://www.tradingview.com/',
        Origin: 'https://www.tradingview.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    }),
  )
}

export const tvc = async (req, res) => {
  try {
    client = client || createClient()

    const symbol = req.query.symbol || '23677'
    const resolution = req.query.resolution || 'M'
    const from = req.query.from || Math.floor(Date.now() / 1000 - 365 * 24 * 3600) // 1 year ago
    const to = req.query.to || Math.floor(Date.now() / 1000)

    // Step 1: Warm up + get fresh __cf_bm cookie
    await client.get(TVC_BASE, { timeout: 10000 })

    // Cloudflare needs ~4–6 seconds after first request
    await new Promise((r) => setTimeout(r, 5500))

    // Step 2: Generate the dynamic endpoint (this is the trick!)
    const { data: init } = await client.get(`${TVC_BASE}/`)
    const sessionMatch = init.match(/"session":"([^"]+)"/)
    const timestamp = Math.floor(Date.now() / 1000)
    if (!sessionMatch) throw new Error('Session not found')

    const sessionId = sessionMatch[1]
    const path = `${sessionId}/${timestamp}/51/51/15/history`

    const url = `${TVC_BASE}/${path}?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`

    // Step 3: Fetch actual data
    const { data } = await client.get(url)

    // Clean TradingView's JSONP wrapper: }while(1);{...}
    const jsonString = data.replace(/^\}\)\]\}\'\)\]\}\)\}\);/, '').trim()
    const result = JSON.parse(jsonString)

    //res.status(200).json({
    //  success: true,
    //  symbol,
    //  resolution,
    //  data: result,
    //});
    return result
  } catch (error) {
    console.error('TVC fetch failed:', error.message)
    res.status(500).json({
      success: false,
      error: error.message,
      tip: 'This endpoint is rate-limited. Try again in 30s.',
    })
  }
}
