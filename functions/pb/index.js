import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js'

import { prizeResults, nextPrizeDrawDate, winners } from './pb-api.js'

const VERSION = 'pb-0.0.2'
// Optional: Set defaults for all v2 functions in this file
setGlobalOptions({
  region: 'us-central1',
  maxInstances: 5,
  timeoutSeconds: 60,
  memory: '512MiB', // or "1GiB", "2GiB" if loading ML models
  cpu: 1,
  invoker: 'public', // disables the built-in API-key check
})

const app = express()

app.use(cors({ origin: true }))
app.use(apiKeyValidation)
app.use(express.json())

app.get('/version', async (req, res) => res.send(VERSION))

app.get('/results', async (req, res) => {
  const { holders } = req.query
  let results = await prizeResults(holders)
  return res.status(200).json(results)
})

app.get('/nextdraw', async (req, res) => {
  return res.status(200).json({ text: await nextPrizeDrawDate() })
})

app.get('/winners', async (req, res) => {
  return res.status(200).json(await winners())
})

export const pb = onRequest(app)
