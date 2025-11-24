import axios from 'axios';
import { load } from 'cheerio'
import { HOST, TEAR_SHEET_PATH } from './ft-constants.js';

export const findSymbolId = async (ticker) => {
    const resource = `${FT.HOST}${FT.TEAR_SHEET_PATH}?s=${ticker}`
    try {
        const {data} = await axios.get(resource)
        const $ = cheerio.load(data)
        const dataModConfig = $('section .mod-tearsheet-add-to-watchlist').attr('data-mod-config')

        let symObj = {}
        if(dataModConfig) {
            dObj = JSON.parse(dataModConfig)
            symObj.xid = dObj.xid
            symObj.symbol = dObj.symbol
        } else {
            symObj = null
        }
        return symObj
    }
    catch (e) { console.log(e) }
    return null
}
