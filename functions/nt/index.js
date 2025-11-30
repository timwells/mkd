import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js'

import { trades, archives, archiveContent } from './nt-api.js'

const VERSION = 'nt-0.0.1'
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
app.get('/trades', async (req, res) => res.send(await trades()))
app.get('/archives', async (req, res) => res.send(await archives()))
app.get('/archiveContent', async (req, res) => res.send(await archiveContent(req.query.a)))

export const nt = onRequest(app)
