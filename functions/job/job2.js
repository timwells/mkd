import axios from 'axios'

const CNN_FEAR_AND_GREED_RESOURCE = 'https://production.dataviz.cnn.io/index/fearandgreed/graphdata'
const CNN_FEAR_AND_GREED_HEADERS = {
  'Accept-Encoding': 'gzip, compress, deflate, br',
  Accept: '*/*',
  Connection: 'keep-alive',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  'Cache-Control': 'no-cache',
}

const CNN_FANDG_PREFIX = 'cnn-fearandgreed'
const CNN_FANDG_CACHE_FOLDER_PATH = 'jobs/cnn-fearandgreed'

const CNN_FANDG_MERGED_FOLDER_PATH = 'jobs/cnn-fearandgreed-merged'
const CNN_FANDG_MERGED_FILENAME = 'cnn-fearandgreed-merged.json'
const CNN_FANDG_MERGED_FILENAME1 = 'cnn-fearandgreed-merged1.json'

function createTimestampFilename(prefix = 'file', ext = 'json') {
  const now = new Date()
  const iso = now.toISOString()
  const safe = iso.replace(/:/g, '-').replace(/\..+/, '')
  return `${prefix}_${safe}.json`
}

export const getMarketSentimentData = async (bucket) => {
  try {
    const { data } = await axios.get(CNN_FEAR_AND_GREED_RESOURCE, { headers: CNN_FEAR_AND_GREED_HEADERS })

    const objectName = createTimestampFilename(CNN_FANDG_PREFIX)
    const filePath = `${CNN_FANDG_CACHE_FOLDER_PATH}/${objectName}`
    const file = bucket.file(filePath)

    await file.save(JSON.stringify(data), {
      contentType: 'application/json',
      resumable: false,
    })
  } catch (err) {
    console.error('Failed to fetch/store CNN Fear & Greed:', err)
    throw err
  }
}

const METRIC_KEYS = [
  'fear_and_greed_historical',
  'market_momentum_sp500',
  'market_momentum_sp125',
  'stock_price_strength',
  'stock_price_breadth',
  'put_call_options',
  'market_volatility_vix',
  'market_volatility_vix_50',
  'junk_bond_demand',
  'safe_haven_demand',
]

const buildMapsFromData = (data) => {
  const maps = {}
  for (const key of METRIC_KEYS) {
    maps[key] = new Map()
    for (const point of data[key]?.data || []) {
      maps[key].set(point.x, point)
    }
  }
  return maps
}

export const mergeMarketSentimentData = async (bucket) => {
  try {
    const mergedFilePath = `${CNN_FANDG_MERGED_FOLDER_PATH}/${CNN_FANDG_MERGED_FILENAME}`
    const [contents] = await bucket.file(mergedFilePath).download()
    const mergedFileData = JSON.parse(contents.toString())

    const maps = buildMapsFromData(mergedFileData)

    const [files] = await bucket.getFiles({ prefix: `${CNN_FANDG_CACHE_FOLDER_PATH}/` })
    if (!files.length) {
      console.log('No files found to merge.')
      return
    }

    for (const file of files) {
      if (!file.name.endsWith('.json')) continue
      const [contents] = await file.download()
      const fgData = JSON.parse(contents.toString())

      for (const key of METRIC_KEYS) {
        for (const point of fgData[key]?.data || []) {
          if (!maps[key].has(point.x)) {
            maps[key].set(point.x, point)
          }
        }
      }
    }

    const merged = {}
    for (const key of METRIC_KEYS) {
      merged[key] = {
        data: Array.from(maps[key].values()).sort((a, b) => a.x - b.x),
      }
    }

    await bucket
      .file(`${CNN_FANDG_MERGED_FOLDER_PATH}/${CNN_FANDG_MERGED_FILENAME}`)
      .save(JSON.stringify(merged), { contentType: 'application/json' })

    // 5️⃣ Delete original files (only after success)
    const ageDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    const filesToDelete = files.filter((file) => {
      return file.name.endsWith('.json') && new Date(file.metadata.timeCreated) < ageDaysAgo
    })
    await Promise.all(filesToDelete.map((file) => file.delete()))
  } catch (err) {
    console.error('Merge job failed:', err)
    throw err
  }
}

export const mergeMarketSentimentData2 = async (bucket) => {
  // get merged file path
  const mergedFilePath = `${CNN_FANDG_MERGED_FOLDER_PATH}/${CNN_FANDG_MERGED_FILENAME}`
  const mergedFile = bucket.file(mergedFilePath)
  const [contents] = await mergedFile.download()
  const mergedFileData = JSON.parse(contents.toString())

  // build map of existing merged data for quick lookup to avoid unnecessary merges
  // fear_and_greed_historical
  const fear_and_greed_historical_Map = new Map()
  for (const point of mergedFileData.fear_and_greed_historical.data || []) {
    fear_and_greed_historical_Map.set(point.x, point) // key by timestamp
  }
  // market_momentum_sp500
  const market_momentum_sp500_Map = new Map()
  for (const point of mergedFileData.market_momentum_sp500.data || []) {
    market_momentum_sp500_Map.set(point.x, point) // key by timestamp
  }
  // market_momentum_sp125
  const market_momentum_sp125_Map = new Map()
  for (const point of mergedFileData.market_momentum_sp125.data || []) {
    market_momentum_sp125_Map.set(point.x, point) // key by timestamp
  }
  // stock_price_strength
  const stock_price_strength_Map = new Map()
  for (const point of mergedFileData.stock_price_strength.data || []) {
    stock_price_strength_Map.set(point.x, point) // key by timestamp
  }
  // stock_price_breadth
  const stock_price_breadth_Map = new Map()
  for (const point of mergedFileData.stock_price_breadth.data || []) {
    stock_price_breadth_Map.set(point.x, point) // key by timestamp
  }
  // put_call_options
  const put_call_options_Map = new Map()
  for (const point of mergedFileData.put_call_options.data || []) {
    put_call_options_Map.set(point.x, point) // key by timestamp
  }
  // market_volatility_vix
  const market_volatility_vix_Map = new Map()
  for (const point of mergedFileData.market_volatility_vix.data || []) {
    market_volatility_vix_Map.set(point.x, point) // key by timestamp
  }
  // market_volatility_vix_50
  const market_volatility_vix_50_Map = new Map()
  for (const point of mergedFileData.market_volatility_vix_50.data || []) {
    market_volatility_vix_50_Map.set(point.x, point) // key by timestamp
  }
  // junk_bond_demand
  const junk_bond_demand_Map = new Map()
  for (const point of mergedFileData.junk_bond_demand.data || []) {
    junk_bond_demand_Map.set(point.x, point) // key by timestamp
  }
  // safe_haven_demand
  const safe_haven_demand_Map = new Map()
  for (const point of mergedFileData.safe_haven_demand.data || []) {
    safe_haven_demand_Map.set(point.x, point) // key by timestamp
  }

  try {
    // 1️⃣ List all files in source folder
    const [files] = await bucket.getFiles({ prefix: `${CNN_FANDG_CACHE_FOLDER_PATH}/` })

    if (!files.length) {
      console.log('No files found to merge.')
      return
    }

    for (const file of files) {
      if (!file.name.endsWith('.json')) continue

      const [contents] = await file.download()
      const fgData = JSON.parse(contents.toString())

      // fear_and_greed_historical
      for (const point of fgData.fear_and_greed_historical.data || []) {
        // only add if timestamp not already in merged file
        if (!fear_and_greed_historical_Map.has(point.x)) {
          fear_and_greed_historical_Map.set(point.x, point)
        }
      }

      // market_momentum_sp500
      for (const point of fgData.market_momentum_sp500.data || []) {
        if (!market_momentum_sp500_Map.has(point.x)) {
          market_momentum_sp500_Map.set(point.x, point)
        }
      }
      // market_momentum_sp125
      for (const point of fgData.market_momentum_sp125.data || []) {
        if (!market_momentum_sp125_Map.has(point.x)) {
          market_momentum_sp125_Map.set(point.x, point)
        }
      }
      // stock_price_strength
      for (const point of fgData.stock_price_strength.data || []) {
        if (!stock_price_strength_Map.has(point.x)) {
          stock_price_strength_Map.set(point.x, point)
        }
      }
      // stock_price_breadth
      for (const point of fgData.stock_price_breadth.data || []) {
        if (!stock_price_breadth_Map.has(point.x)) {
          stock_price_breadth_Map.set(point.x, point)
        }
      }
      // put_call_options
      for (const point of fgData.put_call_options.data || []) {
        if (!put_call_options_Map.has(point.x)) {
          put_call_options_Map.set(point.x, point)
        }
      }
      // market_volatility_vix
      for (const point of fgData.market_volatility_vix.data || []) {
        if (!market_volatility_vix_Map.has(point.x)) {
          market_volatility_vix_Map.set(point.x, point)
        }
      }
      // market_volatility_vix_50
      for (const point of fgData.market_volatility_vix_50.data || []) {
        if (!market_volatility_vix_50_Map.has(point.x)) {
          market_volatility_vix_50_Map.set(point.x, point)
        }
      }
      // junk_bond_demand
      for (const point of fgData.junk_bond_demand.data || []) {
        if (!junk_bond_demand_Map.has(point.x)) {
          junk_bond_demand_Map.set(point.x, point)
        }
      }
      // safe_haven_demand
      for (const point of fgData.safe_haven_demand.data || []) {
        if (!safe_haven_demand_Map.has(point.x)) {
          safe_haven_demand_Map.set(point.x, point)
        }
      }
    }

    const merged = {}

    merged.fear_and_greed_historical = {
      data: Array.from(fear_and_greed_historical_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.market_momentum_sp500 = {
      data: Array.from(market_momentum_sp500_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.market_momentum_sp125 = {
      data: Array.from(market_momentum_sp125_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.stock_price_strength = {
      data: Array.from(stock_price_strength_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.stock_price_breadth = {
      data: Array.from(stock_price_breadth_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.put_call_options = {
      data: Array.from(put_call_options_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.market_volatility_vix = {
      data: Array.from(market_volatility_vix_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.market_volatility_vix_50 = {
      data: Array.from(market_volatility_vix_50_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.junk_bond_demand = {
      data: Array.from(junk_bond_demand_Map.values()).sort((a, b) => a.x - b.x),
    }
    merged.safe_haven_demand = {
      data: Array.from(safe_haven_demand_Map.values()).sort((a, b) => a.x - b.x),
    }

    const mergedBucketFile = bucket.file(`${MERGED_FOLDER_PATH}/${MERGED_FILENAME}`)

    await mergedBucketFile.save(JSON.stringify(merged), { contentType: 'application/json' })
  } catch (err) {
    console.error('Merge job failed:', err)
    throw err
  }
}
