import { onSchedule } from 'firebase-functions/v2/scheduler'
import admin from 'firebase-admin'

import { getLatestFearAndGreedData, mergeFearAndGreedData } from './job1.js'

import { getMarketSentimentData } from './job2.js'

const CRON_5_MINS = '*/5 * * * *'
const CRON_MIDNIGHT = '0 0 * * *'
const CRON_5_PAST_MIDNIGHT = '5 0 * * *'

admin.initializeApp()

const bucket = admin.storage().bucket()

export const runJobs = onSchedule(
  { schedule: CRON_5_PAST_MIDNIGHT,timeZone: 'UTC'},

  async (event) => {
    await getLatestFearAndGreedData(bucket);
    await mergeFearAndGreedData(bucket);
    await getMarketSentimentData(bucket);
  },
)
