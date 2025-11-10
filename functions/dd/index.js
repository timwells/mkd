import { onRequest } from "firebase-functions/v2/https";
import express, { json } from 'express';
import cors from 'cors';
import { apiKeyCheck } from './middleware/auth.js';
import { exdividenddates, dividenhistory } from './dd-api.js';

const app = express();
app.use(cors({ origin: true }));
app.use(json());
// app.use(apiKeyCheck);

app.get('/exdividenddates', async (req, res) => {
    return res.status(200).json(await exdividenddates())
});

app.get('/dividend-history', async (req, res) => {
    const {divlink} = req.query;
    return res.status(200).json(await dividenhistory(divlink))
});

export const dd = onRequest(app);
