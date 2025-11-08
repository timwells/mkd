import { onRequest } from "firebase-functions/v2/https";
import express  from "express";
import cors  from "cors";

// import { sentiment } from "./nt-api.js"

const VERSION = 'nt-0.0.1';
const app = express();

app.use(cors({ origin: true }));
//app.use(checkApiKey);
app.use(express.json());

app.get('/version', async (req, res) => res.send(VERSION) )

export const nt = onRequest({ runtime: "nodejs20" },app);
