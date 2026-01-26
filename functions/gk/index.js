import { onRequest } from 'firebase-functions/v2/https';
import { googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { geminiApiKey } from './secrets.js';

// simple async sleep helper
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Gemnin API key from https://aistudio.google.com/api-keys
// firebase functions:secrets:set GEMINI_API_KEY to place secure in vault

export const gk = onRequest(
  { secrets: [geminiApiKey] },
  async (req, res) => {
    try {
      const prompt =
        req.body?.prompt ??
        'Give a detailed explanation of GenKit in clear steps.';

      // ✅ resolve secret at runtime
      const key = await geminiApiKey.value();

      // ✅ init GenKit
      const ai = genkit({
        plugins: [googleAI({ apiKey: key })],
        model: googleAI.model('gemini-2.5-flash')
      });

      // ✅ streaming-friendly headers
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Transfer-Encoding', 'chunked');

      // 1️⃣ Generate full response
      const result = await ai.generate({ prompt });

      // 2️⃣ Normalize text output
      const text =
        typeof result === 'string'
          ? result
          : result.text ??
            result.output_text ??
            result.content ??
            JSON.stringify(result);

      // 3️⃣ Stream back in chunks
      const CHUNK_SIZE = 60;

      for (let i = 0; i < text.length; i += CHUNK_SIZE) {
        const chunk = text.slice(i, i + CHUNK_SIZE);
        res.write(chunk);
        await sleep(25); // small delay to force flush
      }

      // 4️⃣ Finish response
      res.end();
    } catch (err) {
      console.error('Gemini MVP failed', err);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Gemini generation failed',
          note: err.message
        });
      }
    }
  }
);
