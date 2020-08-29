// https://sec-api.io/

const axios = require('axios');
const cheerio = require('cheerio');

function sec (apiKey) {
    return Object.freeze({
        getFilings,
        findDilution
    });

    async function getFilings ({ ticker }) {
        const url = buildRequest();
        const payload = {
            query: { "query_string": { query: `ticker:${ticker}` } },
            from: "0",
            size: "30",
            sort: [{ filedAt: { order: "desc" } }]
        };

        try {
            let response = await axios.post(url, payload);

            return response.data.filings;
        }catch (error) {
            return null;
        }

    }

    async function findDilution ({ filingList }) {
        const formTypes = ['10-Q', '10-K', '10-F'];

        // Loop through reports until we find one in formTypes
        for (let i = 0; i < filingList.length; i ++) {
            // If its a quarter/annual  report
            if (formTypes.includes(filingList[i].formType) && filingList[i].linkToFilingDetails) {
                let html = await axios.get(filingList[i].linkToFilingDetails);
                html = html.data;

                return {
                    warrants: search(html, ['warrant', 'Warrant']),
                    atm: search(html, [' ATM ', ' atm ', 'At-the-market', 'at-the-market']),
                    shelf: search(html, ['shelf', 'Shelf']),
                    liquidity: search(html, ['liquidity']),
                    convertible: search(html, ['Convertible', 'convertible'])
                }
            }
        }
    }

    function search (html, values = []) {
        for (let i = 0; i < values.length; i++) {
            let s = html.search(values[i]);

            if (s !== -1) {
                return true;
            }
        }

        return false;
    }

    function buildRequest () {
        let baseUrl = `https://api.sec-api.io?token=${apiKey}`;
        
        return baseUrl;
    }
}

module.exports = sec;