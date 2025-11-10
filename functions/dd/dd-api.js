import axios from 'axios'
const DIVIDENDDATA_SITE3 = "https://www.exdividenddate.co.uk"
const HEADERS = { headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8', 
    'Accept-Language': 'en-US,en;q=0.5', 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
}}

// Fetches ex-dividend dates from DIVIDENDDATA_SITE3 and parses the table rows
export const exdividenddates = async () => {
    const dividendData = [];
    try {
        // Request the ex-dividend page HTML
        const { data } = await axios.get(DIVIDENDDATA_SITE3, HEADERS);
        const $ = load(data);

        // Select all table rows except the header
        $("#ctl00_ContentPlaceHolder1_lvExDividendDate_itemPlaceholderContainer tr").slice(1).each((_, el) => {
            const cells = $(el).find('td');
            if (cells.length) {
                // Destructure each cell for clarity
                const [epicCell, nameCell, marketCell, exDateCell, amountCell, payDateCell] = cells.toArray();
                const exDateStr = $(exDateCell).text().trim();

                // Parse ex-dividend date string into a Date object
                const [day, month, year] = exDateStr.split('/').map(Number);
                const exDate = new Date(year, month - 1, day);

                // Push parsed data into the result array
                dividendData.push({
                    epic: $(epicCell).text().trim() || '?',
                    name: $(nameCell).text().trim() || '',
                    href: $(nameCell).find('a').attr('href'),
                    market: $(marketCell).text().trim() || '',
                    exDate: exDateStr || '',
                    amount: +parseFloat(($(amountCell).text() || '').replace(/[^0-9.]/g, '')).toFixed(2) || 0.00,
                    payDate: $(payDateCell).text().trim() || '',
                    // Calculate days remaining until ex-dividend date
                    daysToGo: Math.ceil((exDate - new Date()) / (1000 * 3600 * 24))
                });
            }
        });
    } catch (e) {
        // Handle errors silently
    }
    return { data: dividendData };
}

// Fetches dividend history for a given dividend link from DIVIDENDDATA_SITE3
export const dividenhistory = async (divlink) => {
    const dividends = [];
    try {
        // Request the dividend history page HTML
        const { data } = await axios.get(`${DIVIDENDDATA_SITE3}/${divlink}`, HEADERS);
        const $ = load(data);

        // Select all table rows except the header
        $("#ctl00_ContentPlaceHolder1_DividendHistoryGridView tr").slice(1).each((_, el) => {
            const cells = $(el).find('td');
            if (cells.length) {
                // Extract and trim text from each cell
                const [exDate, payDate, type, amountCell] = cells.map((i, el2) => $(el2).text().trim()).get();
                // Push parsed data into the result array
                dividends.push({
                    exDate: exDate || '?',
                    payDate: payDate || '',
                    type: type || '',
                    amount: +parseFloat((amountCell || '').replace(/[^0-9.]/g, '')).toFixed(2) || 0.00
                });
            }
        });
    } catch (e) {
        // Handle errors silently
    }
    // Return the dividend history data with the provided link as id
    return { id: divlink, data: dividends };
}
