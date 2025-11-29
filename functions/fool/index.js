import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from "firebase-functions/v2";

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js';

import { getDataImpl, getDataImpl2, getDataValuesImpl } from './fool-api.js'
// Optional: Set defaults for all v2 functions in this file
setGlobalOptions({
  region: "us-central1",
  maxInstances: 5,
  timeoutSeconds: 60,
  memory: "512MiB",     // or "1GiB", "2GiB" if loading ML models
  cpu: 1,
  invoker: "public"     // disables the built-in API-key check
});
const VERSION = 'fool-0.0.1'

const app = express()
app.use(cors({ origin: true }))
app.use(express.json())
app.use(apiKeyValidation);

app.get('/version', async (req, res) => res.send(VERSION))

app.get('/historical', async (req, res) => {
  const { exchange, symbol, precision, period } = req.query
  return res.status(200).json(await getDataImpl(exchange, symbol, precision, period))
})

app.get('/historical2', async (req, res) => {
  const { exchange, symbol, precision, period } = req.query
  return res.status(200).json(await getDataImpl2(exchange, symbol, precision, period))
})

app.get('/historical/values', async (req, res) => {
  const { exchange, symbol, precision, period } = req.query
  return res.status(200).json(await getDataValuesImpl(exchange, symbol, precision, period))
})

export const fool = onRequest(app)
