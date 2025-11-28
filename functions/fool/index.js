import { onRequest } from "firebase-functions/v2/https";
import express from 'express';
import { getDataImpl, getDataImpl2, getDataValuesImpl } from './fool-api.js';

// import checkApiKey from './middleware/auth.js';
import cors from 'cors';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
// app.use(checkApiKey);

const VERSION = 'fool-0.0.1'

app.get('/version', async (req, res) => res.send(VERSION))

app.get('/historical', async (req, res) => {
    const { exchange, symbol, precision, period } = req.query
    return res.status(200).json(await getDataImpl(exchange,symbol,precision,period))
});

app.get('/historical2', async (req, res) => {
    const { exchange, symbol, precision, period } = req.query
    return res.status(200).json(await getDataImpl2(exchange,symbol,precision,period))
});

app.get('/historical/values', async (req, res) => {
    const { exchange, symbol, precision, period } = req.query
    return res.status(200).json(await getDataValuesImpl(exchange,symbol,precision,period))
});

export const fool = onRequest({ runtime: 'nodejs20' }, app)
