import { onSchedule } from 'firebase-functions/v2/scheduler'
// import admin from 'firebase-admin'
import { getFearAndGreedData } from './job1.js'

const CRON_5_MINS = "*/5 * * * *"
const CRON_MIDNIGHT = "0 0 * * *"
const CRON_5_PAST_MIDNIGHT = "5 0 * * *"

export const updateFearAndGreed = onSchedule({
    schedule: CRON_5_PAST_MIDNIGHT, 
    timeZone: "UTC",
  },
  async (event) => {
    await getFearAndGreedData();
  }
);
