import axios from 'axios'

const PB_PREFIX = 'pb_'
const PB_SECRETS_FOLDER_PATH = 'jobs/pb-secrets'
const PB_SECRETS_FILENAME = 'pb-secrets.json'
const PB_CACHE_FOLDER_PATH = 'jobs/pb-data'
const PB_MERGED_FOLDER_PATH = 'jobs/pb-merged'
const PB_MERGED_FILENAME = 'pb-merged.json'

function createTimestampFilename(prefix = 'file', ext = 'json') {
  const now = new Date()
  const iso = now.toISOString()
  const safe = iso.replace(/:/g, '-').replace(/\..+/, '')
  return `${prefix}_${safe}.json`
}

export const getPremiumBondData = async (
  bucket,
  cfApiKey,
  cfUrl,
  pbHolders
) => {
  try {
    const resourceUrl = `${cfUrl}/pb/results?holders=${pbHolders}`
    const { data } = await axios.get(resourceUrl, {headers: { 'Content-Type': 'application/json', 'x-api-key': cfApiKey }})
    const objectName = createTimestampFilename(PB_PREFIX)
    const filePath = `${PB_CACHE_FOLDER_PATH}/${objectName}`
    const file = bucket.file(filePath)

    await file.save(JSON.stringify(data), {
      contentType: 'application/json',
      resumable: false,
    })
  } catch (err) {
    console.error('Failed to fetch/store PB data:', err)
    throw err
  }
}

export const mergeMarketSentimentData = async (bucket) => {
}

