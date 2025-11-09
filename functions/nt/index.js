import { onRequest } from 'firebase-functions/v2/https'
import express from 'express'
import cors from 'cors'

import { trades, archives, archiveContent } from './nt-api.js'

const VERSION = 'nt-0.0.1'
const app = express()

app.use(cors({ origin: true }))
//app.use(checkApiKey);
app.use(express.json())

app.get('/version', async (req, res) => res.send(VERSION))
app.get('/trades', async (req, res) => res.send(await trades()))
app.get('/archives', async (req, res) => res.send(await archives()))
app.get('/archiveContent', async (req, res) => res.send(await archiveContent(req.query.a)))

export const nt = onRequest({ runtime: 'nodejs20' }, app)
