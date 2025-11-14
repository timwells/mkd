import { onRequest } from "firebase-functions/v2/https";
import express from 'express';
import cors from 'cors';
// import checkApiKey from '../common/middleware/auth.js';
import { marketSentiment } from './cnn-api.js';

const VERSION = 'cnn-0.0.1';
const app = express();
app.use(cors({ origin: true }));
// app.use(checkApiKey);
app.use(express.json());

app.get('/version', async (req, res) => res.send(VERSION) )

app.get('/marketsentiment', async (req, res) => {
    return res.status(200).json(await marketSentiment())
});

export const cnn = onRequest({ runtime: 'nodejs20' }, app)




