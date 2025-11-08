const { config } = require('./config');

const apiKeyCheck = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Access the api-key from headers

    if (!apiKey) 
        return res.status(401).json({ error: 'API key is missing' });
    
    if(!config.apiKeys.includes(apiKey)) 
        return res.status(403).json({ error: 'Invalid API key' });

    // If API key is valid, proceed to the next middleware or route handler
    next();
};

module.exports = apiKeyCheck;