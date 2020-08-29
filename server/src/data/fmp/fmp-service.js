// https://financialmodelingprep.com/
const axios = require('axios');

function fmp (apiKey) {
    return Object.freeze({
        getFilingData,
        getStockData,
        gapStats
    });

    async function getStockData ({ ticker }) {
        let cp = companyProfile({ ticker });
        let q = quote({ ticker });

        [ cp, q ] = await Promise.all([ cp, q ]);

        return {
            q,
            cp,
        }
    }

    async function getFilingData ({ ticker }) {
        let bs = balanceSheet({ ticker }); // Promise
        let cf = cashFlow({ ticker }); // Promise
        let is = incomeStatement({ ticker }); // Promise
        [ bs, cf, is ] = await Promise.all([ bs, cf, is ]);
        let fd = await findDilution({ url: bs[0].finalLink });

        // Only return first two responses
        bs = bs.slice(0, 2),
        cf = cf.slice(0, 2);
        is = is.slice(0,2);

        return {
            bs,
            cf,
            is,
            fd
        }
    }

    async function gapStats ({ ticker }) {
        const data = await historicalQuotes({ ticker });
        let bars = [];
        let totalPercent = 0;
        let closesBelowOpen = 0;

        for (let i = 0; i < data.length; i++) {
            // If it isnt the first bar of the data
            if (data[i+1]) {
                // gaps above 20%
                if (getGapPercent(data[i+1]['close'], data[i]['open']) > 20) {
                    bars.push(data[i]);

                    // Add % to get average
                    totalPercent += getGapPercent(data[i+1]['close'], data[i]['open']);

                    // Closes below open?
                    if (data[i]['close'] < data[i]['open']) {
                        // Add total close below open
                        closesBelowOpen++;
                    }
                }
            }
        }

        return {
            gapsAbove20Percent: bars.length,
            averageGapPercent: round(totalPercent / bars.length),
            previousGapsHigh: bars[0]['high'],
            closesBelowOpen: closesBelowOpen,
            closeBelowOpenPercent: round(closesBelowOpen / bars.length),
            previousGapDayVolume: bars[0]['volume'],
        };
    
    }

    async function historicalQuotes ({ ticker }) {
        // 253 trading days in a year

        let url = buildRequest(`/historical-price-full/${ticker.toUpperCase()}`);

        try {
            let response = await axios.get(url);
            let bars = response.data.historical.slice(0, 1265); // 5 Years ish

            return bars;
        }catch (error) {
            throw Error(`Could not get stock quote history. Error: ${error.message}`);
        }
    }

    async function companyProfile ({ ticker }) {
        let url = buildRequest(`/profile/${ticker}`);

        return axios.get(url)
            .then(response => response.data)
            .catch(error => null);
    }

    async function quote ({ ticker }) {
        let url = buildRequest(`/quote-short/${ticker}`);

        return axios.get(url)
            .then(response => response.data.price)
            .catch(error => null)
    }

    function balanceSheet ({ ticker }) {
        let url = buildRequest(`/balance-sheet-statement/${ticker.toUpperCase()}`, { period: 'quarter' });

        return axios.get(url)
            .then(response => response.data)
            .catch(error => null);
    }

    function cashFlow ({ ticker }) {
        let url = buildRequest(`/cash-flow-statement/${ticker.toUpperCase()}`, { period: 'quarter' });

        return axios.get(url)
            .then(response => response.data)
            .catch(error => null);
    }

    function incomeStatement ({ ticker }) {
        let url = buildRequest(`/income-statement/${ticker.toUpperCase()}`, { period: 'quarter' });

        return axios.get(url)
            .then(response => response.data)
            .catch(error => null);
    }

    async function findDilution ({ url }) {
        let html = await axios.get(url);
        html = html.data;

        return {
            warrants: search(html, ['warrant', 'Warrant']),
            atm: search(html, [' ATM ', ' atm ', 'At-the-market', 'at-the-market']),
            shelf: search(html, ['shelf', 'Shelf']),
            liquidity: search(html, ['liquidity']),
            convertible: search(html, ['Convertible', 'convertible'])
        }
    }

    function getGapPercent (previousClose, open) {
        if (previousClose && open) {
            const diff = open - previousClose;
            const diffPercent = (diff / previousClose) * 100;

            return round(diffPercent);
        }
        return false;
    }

    function buildRequest (url, params = {}) {
        let baseUrl = `https://financialmodelingprep.com/api/v3${url}?apikey=${apiKey}`;

        if (params) {
            for (let key in params) {
                baseUrl += `&${key}=${params[key]}`;
            }
        }

        return baseUrl;
    }

    function round (num) {
        return Math.round((num + Number.EPSILON) * 100) / 100
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
}

module.exports = fmp;