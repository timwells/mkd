import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'

import admin from 'firebase-admin'

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js'
import { marketSentiment } from './cnn-api.js'

admin.initializeApp()
const bucket = admin.storage().bucket()

const VERSION = 'cnn-0.0.2'

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
app.get('/marketsentiment', async (req, res) => {
  return res.status(200).json(await marketSentiment(bucket))
})

//app.get('/_marketsentiment', async (req, res) => {
//  return res.status(200).json(await _marketSentiment(bucket))
//})

export const cnn = onRequest(app)
