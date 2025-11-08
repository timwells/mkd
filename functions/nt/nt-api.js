import axios  from "axios";
import moment  from "moment";
import * as cheerio  from "cheerio";

const NT_SITE_URL = "https://www.nakedtrader.co.uk"
const NT_SITE_TRADES = NT_SITE_URL + "/trades.htm?type=sh"
const NT_SITE_ARCHIVES = NT_SITE_URL + "/archive.htm"

export const trades = async () => {
    const {data} = await axios.get(NT_SITE_TRADES,{ headers: { Cookie: "nt=1;" } })
    const $ = cheerio.load(data);
    const allTrades = [];
    const headers = [];
    const openTrades = [];
    const closedTrades = [];
    let nAllTrades = 0; 
    let nGains = 0;
    let nLosses = 0;
    let nOpenTrades = 0
    let nClosedTrades = 0
    let openOrderCost = 0.0

    // Extract columns once from table
    $('.trades>tbody>tr>th').each((i, e) => { headers.push($(e).text().trim().toLowerCase().replace("/","").replace(" ",""))});
        
    $(".trades>tbody>tr").each((i, e) => {
        let rowObj = {};
        let textId = [0,1,6,8]

        $(e).find("td").each((i, e) => {                
            let item = $(e).text().trim();
            if(textId.includes(i)) { rowObj[headers[i]] = item } 
            else { rowObj[headers[i]] = (item.length > 0) ? parseFloat(item) : item; }
        });

        // Valdiate Order
        if(Object.keys(rowObj).length > 0) {
            if(rowObj["stock"].length > 0 && rowObj["epic"].length > 0 && rowObj["buydate"].length > 0 && rowObj["price"] > 0) {

                // Validate Buy Date
                let splitDate = rowObj["buydate"].split("/");
                let newBuyDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}` 
                                        
                let baseDate = Date.parse("2010-01-01");
                let buyDate = Date.parse(newBuyDate);

                if(buyDate > baseDate) {
                    rowObj["tc"] = +((rowObj["qty"] * rowObj["price"]) / 100).toFixed(2)
                    rowObj["pd"] = +(rowObj["target"] - rowObj["price"]).toFixed(2)
                    rowObj["cp"] = +(100 * (rowObj["target"] - rowObj["price"]) / rowObj["price"]).toFixed(2)    
                    
                    rowObj["xp"] = +((rowObj["qty"] * rowObj["target"]) / 100).toFixed(2)    
                    rowObj["xpd"] = +(rowObj["xp"] - rowObj["tc"]).toFixed(2)

                    // Calculate the trading statistics
                    nAllTrades++;
                    let pl = rowObj["pl"]
                    let bd = moment(rowObj["buydate"],"DD/MM/YYYY")
                    let sd = moment(rowObj["selldate"],"DD/MM/YYYY")

                    if(rowObj["selldate"].length > 0) {
                        rowObj["dopn"] = sd.diff(bd, 'days')
                        nClosedTrades++                                                                
                        if(typeof pl === "number") {(pl > 0) ? nGains++ : nLosses++}                                
                        closedTrades.push(rowObj)
                    } else {
                        nOpenTrades++;
                        openOrderCost += rowObj["tc"]
                        let daysOpen = moment().diff(bd,"days")
                        rowObj["buydate"] = `${rowObj["buydate"]}`
                        rowObj["dopn"] = daysOpen
                        openTrades.push(rowObj) 
                    } 
                    allTrades.push(rowObj)
                }
            } else {
                console.log("SKIP:",rowObj["epic"],"Buydate < baseDate")
            }
        }
    });

    let resObj = {
        allTrades: allTrades,
        openTrades: openTrades,
        closedTrades: closedTrades,
        statistics : {
            allTrades: nAllTrades,
            closedTrades: nClosedTrades,
            openTrades: nOpenTrades,
            openOrderCost : parseFloat(openOrderCost.toFixed(2)),
            gains : nGains,
            losses: nLosses,
            gainPercent: +((nGains/nClosedTrades)*100).toFixed(2),
            lossPercent: +((nLosses/nClosedTrades)*100).toFixed(2),
        }
    }

    return resObj
}

export const archives = async () => {
    let records = []
    const {data} = await axios.get(NT_SITE_ARCHIVES,{ headers: { Cookie: "nt=1;" } })
        
    const $ = cheerio.load(data);
    const sel = '#center2 > h2';
    $(sel).each((i, e) => {                
        let archive = { yearMonth: e.children[0].data, archives:[] }
        for(let a = 0; a < e.next.children.length; a++) {
            let _href = e.next.children[a].children[0].attribs["href"].replace(".",NT_SITE_URL)
            let _name = e.next.children[a].children[0].children[0].data
            let _id = _href.split("=")[1]
            archive.archives.push({name:_name, href:_href, id:_id})
        }
        records.push(archive)
    })
    return records;
}

export const archiveContent = async (a) => {
    // const {data} = await axios.get(`${req.query.a}`,{ headers: { Cookie: "nt=1;" } })
    const {data} = await axios.get(`${a}`,{ headers: { Cookie: "nt=1;" } })
    const $ = await cheerio.load(data);
    const sel = '#center2';
    let html = ""
    $(sel).each((i, e) => {
        html = $(e).html().replaceAll("Site updated every other Thursday afternoon","")
        html = html.replaceAll("h1","h5").replaceAll("h2","h6")
    })
    res.status(200).send(html)
}

