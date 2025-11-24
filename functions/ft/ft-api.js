import axios from 'axios';
import { PAYLOAD_BODY,HOST,SERIES_PATH,tickerMap } from './ft-constants.js'
import { findSymbolId } from './ft-web.js'

const FT_MY_MAPX_FUND_SYMBOLS = [
    {name: "MyMap 3 Fund D Acc", symbol: "543012729", scale: 100.0},
    {name: "MyMap 4 Fund D Acc", symbol: "542997798", scale: 100.0},
    {name: "MyMap 5 Select ESG Fund D Acc", symbol: "604977373", scale: 100.0},
    {name: "MyMap 6 Fund D Acc", symbol: "542990218", scale: 100.0},
    {name: "MyMap 7 Select ESG Fund D Acc", symbol: "722345773", scale: 100.0},
    {name: "Lindsell Train UK EqtyFund D Acc", symbol: "72625433", scale: 1.0}
]


/*
US10Y
{
    "days": 10811,
    "dataNormalized": false,
    "dataPeriod": "Month",
    "dataInterval": 1,
    "realtime": false,
    "yFormat": "0.###",
    "timeServiceFormat": "JSON",
    "rulerIntradayStart": 26,
    "rulerIntradayStop": 3,
    "rulerInterdayStart": 10957,
    "rulerInterdayStop": 365,
    "returnDateType": "ISO8601",
    "elements": [
        {
            "Label": "c704a744",
            "Type": "price",
            "Symbol": "11523680",
            "OverlayIndicators": [],
            "Params": {}
        }
    ]
}

*/


// { time: "2024-08-31", value 1.0 }
export const myMapFunds = async () => {
    let dataObj = []
    for(let fund = 0; fund < FT_MY_MAPX_FUND_SYMBOLS.length; fund++ ) {
        let payLoad = PAYLOAD_BODY;
        payLoad.elements[0].Symbol = FT_MY_MAPX_FUND_SYMBOLS[fund].symbol
        let scale = FT_MY_MAPX_FUND_SYMBOLS[fund].scale
        try {
            const { data } = await axios.post(`${HOST}${SERIES_PATH}`,payLoad)
            let dv = []
            for(let i=0; i < data.Dates.length; i++) {
                dv.push({
                    time: data.Dates[i].split('T')[0], 
                    value: scale * (data.Elements[0].ComponentSeries[data.Elements[0].ComponentSeries.length-1].Values[i])
                })
            }
            dataObj.push({name:data.Elements[0].CompanyName, data:dv })
        } catch(e) {
            console.log(e)
            return []
        }
    }
    return dataObj
}

export const getSeries = async (ticker) => {
    let result = tickerMap.get(ticker)

    if(result == null) {
        result = await findSymbolId(ticker)
    }

    let dataObj = null;
    if(result) {
        let payLoad = PAYLOAD_BODY;
        payLoad.elements[0].Symbol = result.xid
        try {
            const { data } = await axios.post(`${HOST}${SERIES_PATH}`,payLoad)
            let dv = []
            for(let i = 0; i < data.Dates.length; i++) {
                dv.push({
                    time: data.Dates[i].split('T')[0], 
                    value: (data.Elements[0].ComponentSeries[data.Elements[0].ComponentSeries.length-1].Values[i])
                })
            }
            dataObj = { name: data.Elements[0].CompanyName, data:dv };
            return dataObj
        } catch(e) { console.log(e.error) }        
    }
    return dataObj
}

export const lookUpSymbol = async (ticker) => {
    return await findSymbolId(ticker)
}

export const lookUpSymbol2 = async (ticker) => {
    return tickerMap.get(ticker)
}
