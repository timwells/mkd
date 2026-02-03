import { onRequest } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2'
import { defineSecret } from 'firebase-functions/params'
import { genkit } from 'genkit'
import { googleAI } from '@genkit-ai/google-genai' // ← only this export is needed

import express from 'express'
import cors from 'cors'

import { apiKeyValidation } from './middleware/auth.js'

// Define secret – set via: firebase functions:secrets:set GEMINI_API_KEY
const geminiApiKey = defineSecret('GEMINI_API_KEY')

const app = express()
const VERSION = 'gk-0.0.4'

setGlobalOptions({
  region: 'us-central1',
  maxInstances: 5,
  timeoutSeconds: 300,
  memory: '2GiB',
  cpu: 1,
  // invoker: 'public',  // ← comment out / remove in production → use App Check
})

app.use(cors({ origin: true }))
app.use(apiKeyValidation)
app.use(express.json())

app.get('/version', (req, res) => res.send(VERSION))

app.post('/ai', async (req, res) => {
  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : ''
  if (!prompt) {
    res.status(400).json({ error: 'Missing or empty prompt' })
    return
  }
  if (prompt.length > 8000) {
    res.status(400).json({ error: 'Prompt too long' })
    return
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  // res.write('data: connected\n\n');

  try {
    const ai = genkit({
      plugins: [
        googleAI({
          apiKey: geminiApiKey.value(), // resolved at runtime
        }),
      ],
      // Optional: defaultModel: 'gemini-2.5-flash',  // can set here too
    })

    const { stream } = await ai.generateStream({
      model: 'googleai/gemini-2.5-pro', // ← string reference (stronger reasoning)
      // model: 'gemini-2.5-flash',  // faster/cheaper alternative
      // model: 'googleai/gemini-2.5-pro',  // fully qualified if needed
      prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    })

    for await (const chunk of stream) {
      const text = chunk.text ?? ''
      if (text.trim()) {
        res.write(`${text}`)
      }
    }

    res.write('\n\n[DONE]')
    res.end()
  } catch (err) {
    console.error('Generation error:', err)
    const msg = err.message || 'Unknown error'
    if (!res.headersSent) {
      res.status(500).json({ error: 'Generation failed', details: msg })
    } else {
      res.write(`data: [ERROR] ${msg}\n\n`)
      res.end()
    }
  }
})

export const gk = onRequest({ secrets: [geminiApiKey] }, app)
