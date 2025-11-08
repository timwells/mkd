import axios from "axios"
const SENTIMENT_URL = "https://adalytica.io/signals/ticker-data";

export const sentiment = async (ticker, freq) => {
    const POST_BODY = { ticker, freq };
    try {
        const { data } = await axios.post(SENTIMENT_URL, POST_BODY);
        return { success: true, data };
    } catch (error) {
        console.error(`Sentiment API Error: ${error.message}`);
        return { success: false, error: error.message };
    }
};


