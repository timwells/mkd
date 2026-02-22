import axios from 'axios'
import admin from 'firebase-admin'

// admin.initializeApp()
// const bucket = admin.storage().bucket()

const FANDG_SITE_URL = 'https://cdn.jmbullion.com/fearandgreed/fearandgreed.json'

const FANDG_PREFIX = 'fearandgreed'
const JOB_CACHE_FOLDER_PATH = 'jobs/fearandgreed'
const MERGED_FOLDER_PATH = 'jobs/fearandgreed-merged'
const MERGED_FILENAME = 'fearandgreed-merged.json'

function createTimestampFilename(prefix = 'file', ext = 'json') {
  const now = new Date()
  const iso = now.toISOString()
  const safe = iso.replace(/:/g, '-').replace(/\..+/, '')

  return `${prefix}_${safe}.json`
}

export const getLatestFearAndGreedData = async (bucket) => {
  try {
    const { data } = await axios.get(FANDG_SITE_URL, {timeout: 10000})

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

export const mergeFearAndGreedData = async (bucket) => {
  try {
    // 1️⃣ List all files in source folder
    const [files] = await bucket.getFiles({
      prefix: `${JOB_CACHE_FOLDER_PATH}/`
    })

    if (!files.length) {
      console.log('No files found to merge.')
      return
    }

    const merged = {}

    // 2️⃣ Download + merge
    for (const file of files) {
      if (!file.name.endsWith('.json')) continue

      console.log(`Processing ${file.name}`)

      const [contents] = await file.download()
      const json = JSON.parse(contents.toString())

      // Merge — latest file overwrites duplicate date keys
      Object.assign(merged, json)
    }

    // 3️⃣ Sort by date ascending
    const sorted = Object.keys(merged)
      .sort()
      .reduce((acc, key) => {
        acc[key] = merged[key]
        return acc
      }, {})

    // 4️⃣ Write merged file
    const mergedFile = bucket.file(`${MERGED_FOLDER_PATH}/${MERGED_FILENAME}`)

    await mergedFile.save(JSON.stringify(sorted),{ contentType: 'application/json' })

    console.log('Merged file written successfully.')

    // 5️⃣ Delete original files (only after success)
    await Promise.all(
      files.map(file => {
        if (file.name.endsWith('.json')) {
          return file.delete()
        }
      })
    )

  } catch (err) {
      console.error('Merge job failed:', err)
    throw err
  }
}
