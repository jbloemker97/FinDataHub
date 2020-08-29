// https://finnhub.io/
const axios = require('axios');

function fiinhub (apiKey) {
    return Object.freeze({
        getGapStats,
        getFilings
    });

    async function getGapStats ({ ticker }) {
        let quotes = await historicalQuotes({ 
            ticker, 
            yearsAgo: 5,
            resolution: 'D'
        });
        let bars = [];
        let totalPercent = 0;
        let closesBelowOpen = 0;
        let totalAverageLow = 0;
        let totalAverageHigh = 0;

        for (let i = 0; i < quotes['c'].length; i++) {
            // If it isnt the first bar of the data
            if (quotes['c'][i-1]) {
                let gapPercent = getGapPercent(quotes['c'][i-1], quotes['o'][i]);
                if (gapPercent > 20 && quotes['v'][i] > 100000) {
                    // console.log(quotes['t'][i]);
                    bars.push({
                        o: quotes['o'][i],
                        c: quotes['c'][i],
                        h: quotes['h'][i],
                        l: quotes['l'][i],
                        v: quotes['v'][i],
                        prevClose: quotes['c'][i-1],
                        date: timeConverter(quotes['t'][i]),
                        gapPercent: gapPercent
                    });

                    // Add % to get average
                    totalPercent += gapPercent;

                    // Closes below open?
                    if (quotes['c'][i] < quotes['o'][i]) {
                        // Add total closes below open
                        closesBelowOpen++;

                        // Create average low by finding the difference between the open and low
                        let difference = quotes['o'][i] - quotes['l'][i];
                        let highDifference = quotes['h'][i] - quotes['o'][i]; 
                        totalAverageLow += difference / quotes['o'][i]; // returns %
                        totalAverageHigh += highDifference / quotes['o'][i]; // returns %
                    }
                }
            }
        }
        

        if (!bars) return null;
        
        return {
            gapsAbove20Percent: bars.length,
            averageGapPercent: round(totalPercent / bars.length),
            previousGapsHigh: bars[bars.length - 1]['h'],
            closesBelowOpen: closesBelowOpen,
            closeBelowOpenPercent: round(closesBelowOpen / bars.length),
            averageLowWhenClosedBelowOpen: round((totalAverageLow / closesBelowOpen) * 100),
            averageHighWhenClosedBelowOpen: round((totalAverageHigh / closesBelowOpen) * 100),
            previousGapDayVolume: bars[bars.length - 1]['v'],
            bars
        }
    }

    async function getFilings ({ ticker }) {
        let url = buildRequest('/stock/filings', {
            symbol: ticker
        });
        let filings = {
            reports: [], // 10-Q, 10-Q/A 10-K, 10-K/A
            registration: [], // S-1, S-3, S-1/A, S-3/A, 424B5
            events: [] // 8k
        };

        try {
            let response = await axios.get(url);

            for (let i = 0; i < response.data.length; i++) {
                let form = response.data[i].form;

                switch (form) {
                    case '10-Q':
                    case '10-K':
                        filings.reports.push(response.data[i]);
                        break;
                    
                    case 'S-1':
                    case 'S-1/A':
                    case 'S-3':
                    case 'S-3/A':
                    case '424B5':
                        filings.registration.push(response.data[i]);
                        break;

                    case '8-K':
                        filings.events.push(response.data[i]);
                        break
                }
            }

            return filings;
        }catch (error) {
            throw Error(`Could not get filings, Error: ${error.message}`);
        }
    }

    async function historicalQuotes ({ ticker, yearsAgo, resolution = 'D' }) {
        // Set the date to five years ago
        let date = new Date();
        let fromTime = date.getFullYear() - yearsAgo;
        date.setFullYear(fromTime);

        let url = buildRequest('/stock/candle', {
            symbol: ticker.toUpperCase(),
            resolution: resolution,
            from: unix(date.getTime()),
            to: unix(new Date().getTime()), // Now
            adjusted: true
        });

        try {
            let response = await axios.get(url);

            return response.data;
        }catch (error) {
            throw Error(`Could not get stock quote history. Error: ${error.message}`);
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

    function getSwipePercent (open, high) {
        const diff = high - open;
        
        return round((diff / open) * 100);
    }

    function buildRequest (url, params = {}) {
        let baseUrl = `https://finnhub.io/api/v1${url}?token=${apiKey}`;

        if (params) {
            for (let key in params) {
                baseUrl += `&${key}=${params[key]}`;
            }
        }

        return baseUrl;
    }

    function compareDays (a, b) {
        let dateA = new Date(a * 1000);
        let dateB = new Date(b * 1000);

        if (dateA.getDay() === dateB.getDay()) {
            return true;
        }

        return false;
    }

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate() + 1;
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = month + ' ' + date + ', ' + year;
        return time;
      }

    function dateDifference (startDate, endDate) {
        const date1 = new Date(startDate);
        const date2 = new Date(endDate);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
       
        let avgMonth = 30;

        return Math.round(diffDays / avgMonth);
    }

    function round (num) {
        return Math.round((num + Number.EPSILON) * 100) / 100
    }

    function unix (time) {  
        return Math.round(time/1000);
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

module.exports = fiinhub;