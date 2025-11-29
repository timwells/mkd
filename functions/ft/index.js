import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from "firebase-functions/v2";

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js';

import { myMapFunds, getHistoricalSeries, lookUpSymbol, lookUpSymbol2 } from './ft-api.js'

const VERSION = 'ft-0.0.1'
// Optional: Set defaults for all v2 functions in this file
setGlobalOptions({
  region: "us-central1",
  maxInstances: 5,
  timeoutSeconds: 60,
  memory: "512MiB",     // or "1GiB", "2GiB" if loading ML models
  cpu: 1,
  invoker: "public"     // disables the built-in API-key check
});

const app = express()

app.use(cors({ origin: true }))
app.use(apiKeyValidation);
app.use(express.json())

app.get('/version', async (req, res) => res.send(VERSION))

app.get('/mymapfunds', async (req, res) => {
  return res.status(200).json(await myMapFunds())
})

app.get('/historical/series', async (req, res) => {
  const { ticker } = req.query
  return res.status(200).json(await getHistoricalSeries(ticker))
})

app.get('/lookup/symbol', async (req, res) => {
  const { ticker } = req.query
  return res.status(200).json(await lookUpSymbol(ticker))
})

app.get('/lookup2/symbol', async (req, res) => {
  const { ticker } = req.query
  return res.status(200).json(await lookUpSymbol2(ticker))
})

export const ft = onRequest(app)
