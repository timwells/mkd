import { onSchedule } from 'firebase-functions/v2/scheduler'
import { defineSecret } from 'firebase-functions/params'
import admin from 'firebase-admin'

import { getGoldLatestFearAndGreedData, mergeGoldFearAndGreedData, mergeGoldFearAndGreedData2 } from './job1.js'
import { getMarketSentimentData, mergeMarketSentimentData } from './job2.js'
import { getPremiumBondData } from './job3.js'  

// Define secret via: firebase functions:secrets:set CF_API_KEY
// Define secret via: firebase functions:secrets:set CF_URL
// Define secret via: firebase functions:secrets:set PB_HOLDERS
// Access secret via: firebase functions:secrets:access PB_HOLDERS

const CF_API_KEY = defineSecret('CF_API_KEY')
const CF_URL = defineSecret('CF_URL')
const PB_HOLDERS = defineSecret('PB_HOLDERS')

const CRON_15_MINS = '*/15 * * * *'
const CRON_MIDNIGHT = '0 0 * * *'
const CRON_15_PAST_MIDNIGHT = '15 0 * * *'

admin.initializeApp()

const bucket = admin.storage().bucket()

export const runJobs = onSchedule({ 
    schedule: CRON_15_PAST_MIDNIGHT, 
    timeZone: 'UTC',
    secrets: [CF_API_KEY, CF_URL, PB_HOLDERS]  // ← Required to access secrets in the function
  },

  async (event) => {
    await getGoldLatestFearAndGreedData(bucket)
    await mergeGoldFearAndGreedData2(bucket)

    await getMarketSentimentData(bucket)
    await mergeMarketSentimentData(bucket)

    const apiKey = CF_API_KEY.value();
    const baseUrl = CF_URL.value();
    const holders = PB_HOLDERS.value();
    await getPremiumBondData(bucket, apiKey, baseUrl, holders)
  },
)
