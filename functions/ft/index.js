import { onRequest } from 'firebase-functions/v2/https'
import express from 'express'
import cors from 'cors'

import { myMapFunds, getHistoricalSeries, lookUpSymbol, lookUpSymbol2 } from './ft-api.js'

const VERSION = 'ft-0.0.1'
const app = express()

app.use(cors({ origin: true }))
//app.use(checkApiKey);
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

export const ft = onRequest({ runtime: 'nodejs20' }, app)
