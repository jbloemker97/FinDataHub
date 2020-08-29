// https://iexcloud.io/
const axios = require('axios');

function iex (apiKey) {
    return Object.freeze({
        getNews,
        getStockData,
        getFilingData,
        gapStats
    });

    async function getNews ({ ticker, last = 5 }) {
        const url = buildRequest(`/stock/${ticker}/news/last/${last}/`);

        try {
            const news = await axios.get(url);

            return news.data;
        }catch (error) {
            throw Error(error.message);
        }
    }

    async function getStockData ({ ticker }) {
        const q = await quote({ ticker });
        const ks = await keyStats({ ticker });

        return {
            ...q,
            ...ks
        }
    }

    async function getFilingData ({ ticker }) {
        const bs = await balanceSheet({ ticker });
        const is = await incomeStatement({ ticker });
        const cf = await cashFlow({ ticker });

        return {
            balanceSheet: bs,
            incomeStatement: is,
            cashFlow: cf
        }
    }

    async function quote ({ ticker }) {
        const url = buildRequest(`/stock/${ticker}/quote/`);

        try {
            let data = await axios.get(url);
            data = data.data;

            return {
                symbol: data.symbol,
                latestPrice: data.latestPrice,
                companyName: data.companyName,
                primaryExchange: data.primaryExchange,
                change: data.change,
                changePercent: data.changePercent,
                volume: data.volume,
                avgTotalVolume: data.avgTotalVolume,
                isUSMarketOpen: data.isUSMarketOpen
            }
        }catch (error) {
            throw Error(`Could not get stock quote. Error: ${error.message}`);
        }
    }

    async function keyStats ({ ticker }) {
        const url = buildRequest(`/stock/${ticker}/stats/`);

        try {
            let data = await axios.get(url);
            data = data.data;

            return {
                float: data.float,
                sharesOutstanding: data.sharesOutstanding
            }
        }catch (error) {
            throw Error(`Could not get key stats on stock. Error: ${error.message}`);
        }
    }

    async function balanceSheet ({ ticker }) {
        const url = buildRequest(`/stock/${ticker}/balance-sheet`);

        try {
            let data = await axios.get(url);
            data = data.data.balancesheet[0];

            return {
                reportDate: data.reportDate,
                currentCash: data.currentCash,
                shareholderEquity: data.shareholderEquity,
                currentAssets: data.currentAssets,
                totalCurrentLiabilities: data.totalCurrentLiabilities
            }
        }catch (error) {
            throw Error(`Could not get balance sheet on stock. Error: ${error.message}`);
        }
    }

    async function incomeStatement ({ ticker }) {
        const url = buildRequest(`/stock/${ticker}/income/`, { last: 2 });

        try {
            let data = await axios.get(url);
            data = data.data.income;

            return [
                {
                    reportDate: data[0].reportDate,
                    netIncome: data[0].netIncome
                },
                {
                    reportDate: data[1].reportDate,
                    netIncome: data[1].netIncome
                }
            ]
        }catch (error) {
            throw Error(`Could not get income statement on stock. Error: ${error.message}`);
        }
    }

    async function cashFlow ({ ticker }) {
        const url = buildRequest(`/stock/${ticker}/cash-flow`);

        try {
            let data = await axios.get(url);
            data = data.data.cashflow;

            return {
                reportDate: data[0].reportDate,
                cashChange: data[0].cashChange,
                cashFlow: data[0].cashFlow
            };
            
        }catch (error) {
            throw Error(`Could not get cash flow on stock. Error: ${error.message}`);
        }
    }

    async function gapStats ({ ticker }) {
        const url = buildRequest(`/stock/${ticker}/chart/5y/`);
        let bars = [];
        let totalPercent = 0;
        let closesBelowOpen = 0;
        let totalAverageLow = 0;

        try {
            let data = await axios.get(url);
            data = data.data;

            for (let i = 0; i < data.length; i++) {
                // If it isnt the first bar of the data
                if (data[i-1]) {
                    // gaps above 20%
                    if (getGapPercent(data[i-1]['close'], data[i]['open']) > 20) {
                        bars.push(data[i]);

                        // Add % to get average
                        totalPercent += getGapPercent(data[i-1]['close'], data[i]['open']);
    
                        // Closes below open?
                        if (data[i]['close'] < data[i]['open']) {
                            // Add total close below open
                            closesBelowOpen++;
    
                            // Create average low by finding the difference between open and low
                            let difference = data[i]['uOpen'] - data[i]['uLow'];
                            totalAverageLow += difference;

                        }
                    }
                }
            }

            return {
                gapsAbove20Percent: bars.length,
                averageGapPercent: round(totalPercent / bars.length),
                previousGapsHigh: bars[bars.length - 1]['high'],
                closesBelowOpen: closesBelowOpen,
                closeBelowOpenPercent: round(closesBelowOpen / bars.length),
                averageLowFromOpenWhenClosedBelowOpen: round(((totalAverageLow / closesBelowOpen))),
                previousGapDayVolume: bars[bars.length - 1]['volume'],
            };
        }catch (error){
            throw Error(`Could not get gap stats. Error: ${error.message}`);
        }
    }

    /*
        START: Helper Functions
    */

    function round (num) {
        return Math.round((num + Number.EPSILON) * 100) / 100
    }

    function getGapPercent (previousClose, open) {
        if (previousClose && open) {
            const diff = open - previousClose;
            const diffPercent = (diff / previousClose) * 100;

            return round(diffPercent);
        }
        return false;
    }

    function buildRequest (url, params = null) {
        let baseUrl = 'https://cloud.iexapis.com/v1';
        let finalUrl = `${baseUrl}${url}?token=${apiKey}`;

        if (params) {
            for (key in params) {
                finalUrl += `&${key}=${params[key]}`;
            }
        }
        return finalUrl;
    }
}

module.exports = iex;