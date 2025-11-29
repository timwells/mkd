import { config }  from './config.js'

export const apiKeyValidation = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];   // or req.get('x-api-key')

  // 1. Missing key → 401 + JSON
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is missing' });
  }

  // 2. Invalid key → 403 + JSON
  if (!config.apiKeys.includes(apiKey)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  // 3. Valid key → continue to next handler
  next();
};