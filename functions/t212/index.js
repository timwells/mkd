import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js'
import { 
  OpenOrders, 
  OpenOrders2 
} from './t212-api.js'

const VERSION = 't212-0.0.1'
// Optional: Set defaults for all v2 functions in this file
setGlobalOptions({
  region: 'us-central1',
  maxInstances: 3,
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

app.get('/equity/orders', async (req, res) => {
  const t212Key = req.headers['x-t212-key'] || null
  if(!t212Key) { return res.status(400).json({ error: 'Missing x-t212-key header' })}
  
  return res.status(200).json(await OpenOrders(t212Key))  
})

app.get('/equity/orders2', async (req, res) => {
  const t212Key = req.headers['x-t212-key'] || null
  if(!t212Key) { return res.status(400).json({ error: 'Missing x-t212-key header' })}
  
  return res.status(200).json(await OpenOrders2(t212Key))  
})

export const t212 = onRequest(app)
