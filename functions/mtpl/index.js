import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js'

import { datasetImpl } from './mtpl-api.js'

const VERSION = 'mtpl-0.0.1'

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
app.get('/historical/series', async (req, res) => {
  const { ds, mas } = req.query
  let data = await datasetImpl(ds, mas);
  return res.status(200).json(data)
})

app.all(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `No endpoint found for ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  })
})

export const mtpl = onRequest(app)
