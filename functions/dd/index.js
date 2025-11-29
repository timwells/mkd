import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from "firebase-functions/v2";

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js';

import { exdividenddates, dividenhistory } from './dd-api.js'

// Optional: Set defaults for all v2 functions in this file
setGlobalOptions({
  region: "us-central1",
  maxInstances: 5,
  timeoutSeconds: 60,
  memory: "512MiB",     // or "1GiB", "2GiB" if loading ML models
  cpu: 1,
  invoker: "public"     // disables the built-in API-key check
});

const VERSION = 'dd-0.0.1'

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())
app.use(apiKeyValidation);

app.get('/version', async (req, res) => res.send(VERSION))

app.get('/exdividenddates', async (req, res) => {
  return res.status(200).json(await exdividenddates())
})

app.get('/dividend-history', async (req, res) => {
  const { divlink } = req.query
  return res.status(200).json(await dividenhistory(divlink))
})

export const dd = onRequest(app)
