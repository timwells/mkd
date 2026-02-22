import axios from 'axios'
import admin from 'firebase-admin'

// admin.initializeApp()
// const bucket = admin.storage().bucket()

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

const CNN_FANDG_MERGED_FOLDER_PATH = 'jobs/fearandgreed-merged'
const CNN_FANDG_MERGED_FILENAME = 'cnn-fearandgreed-merged.json'

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
