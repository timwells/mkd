import { onRequest } from "firebase-functions/v2/https";
import express  from "express";
import cors  from "cors";

import { sentiment } from "./ada-api.js"

const VERSION = 'ada-0.0.1';
const app = express();

app.use(cors({ origin: true }));
//app.use(checkApiKey);
app.use(express.json());

app.get('/version', async (req, res) => res.send(VERSION) )

app.get('/sentiment', async (req, res) => {
    const { ticker, freq } = req.query;
    let xres = await sentiment(ticker,freq)
    return res.status(200).json(xres.data)
})


export const ada = onRequest({ runtime: "nodejs20" },app);
