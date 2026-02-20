import axios from 'axios'
import admin from 'firebase-admin'

admin.initializeApp()

const bucket = admin.storage().bucket()

const FANDG_SITE_URL = 'https://cdn.jmbullion.com/fearandgreed/fearandgreed.json'
const JOB_CACHE_FOLDER_PATH = 'jobs/fearandgreed'
const FANDG_PREFIX = 'fearandgreed'

function createTimestampFilename(prefix = 'file', ext = 'json') {
  const now = new Date()

  const iso = now.toISOString()
  const safe = iso.replace(/:/g, '-').replace(/\..+/, '')

  return `${prefix}_${safe}.json`
}

export const getFearAndGreedData = async () => {
  try {
    const { data } = await axios.get(FANDG_SITE_URL, {
      timeout: 10000,
    })

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON payload')
    }

    const objectName = createTimestampFilename(FANDG_PREFIX)
    const filePath = `${JOB_CACHE_FOLDER_PATH}/${objectName}`
    const file = bucket.file(filePath)

    await file.save(JSON.stringify(data), {
      contentType: 'application/json',
      resumable: false,
    })
  } catch (err) {
    console.error('Failed to fetch/store Fear & Greed:', err)
    throw err
  }
}
