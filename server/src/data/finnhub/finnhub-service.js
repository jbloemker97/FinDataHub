// https://finnhub.io/
const axios = require('axios');

function fiinhub (apiKey) {
    return Object.freeze({
        getGapStats,
        getFilings,
        getMomoStats
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

    async function getMomoStats ({ ticker }) {
        let date = new Date();
        let fromTime = date.getFullYear() - 5;
        date.setFullYear(fromTime);

        let url = buildRequest('/stock/candle', {
            symbol: ticker,
            resolution: 'D',
            from: unix(date.getTime()),
            to: unix(new Date().getTime()), // Now
            adjusted: false
        });

        let atrTotal = 0;
        let volTotal = 0;

        try {
            let response = await axios.get(url);
            let data = response.data;
            let bars = [];

            // Get averages
            for (let i = 0; i < data.c.length; i++) {
                atrTotal += Math.abs(data.h[i] - data.o[i]); // Range from open to high
                volTotal += data.v[i];
            }

            let atrFactor = 3;
            let volFactor = 3;
            let volOverRideFactor = 20;
            let avgAtr = round(atrTotal / data.c.length);
            let avgVol = round(volTotal / data.v.length);

          console.log(avgAtr, avgVol);

            // Stats
            let totalMomoDays = 0;
            let closesBelowOpen = 0;
            let momoVol = 0;
            let highFromOpen = 0;
            let closeFromHigh = 0;

            for (let i = 0; i < data.c.length; i++) {
                let atr = data.h[i] - data.o[i],
                    atrPercent = atr / data.o[i],
                    v = data.v[i],
                    o = data.o[i],
                    h = data.h[i],
                    l = data.l[i],
                    c = data.c[i],
                    t = data.t[i]

                // If momo day
                // Checks for reverse split bc data given back ISNT adjusted even though docs says it is
                if (atrPercent < 5 && (atr > (atrFactor * avgAtr) && v > (volFactor * avgVol) || (v > volOverRideFactor * avgVol))) {
                    totalMomoDays += 1;
                    momoVol += v;
                    highFromOpen += ((h - o) / o);
                    closeFromHigh += ((h - c) / h);
                    if (o > c) closesBelowOpen++; // Closed red

                    // Push bars
                    bars.push({
                        date: timeConverter(t),
                        open: o,
                        high: h,
                        low: l,
                        close: c,
                        volume: v,
                        atr,
                        highsFromOpenPercent: round(((h - o) / o) * 100),
                        closeFromHighPercent: round(((h - c) / h) * 100),
                        closedBelowOpen: (o > c) ? true : false,
                        gapAbove20Percent: (getGapPercent(data.c[i-1], o) > 20) ? true : false
                    });
                }
            }

            return {
                totalMomoDays,
                closesBelowOpen,
                avgMomoVol: round(momoVol / totalMomoDays),
                avgHighFromOpenPercent: round(highFromOpen / totalMomoDays) * 100,
                avgCloseFromHighPercent: round(closeFromHigh / totalMomoDays) * 100,
                bars
            }
        }catch (error) {
            throw Error(`Could not get indicator history. Error: ${error.message}`);
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

    function buildRequest (url, params = {}) {
        let baseUrl = `https://finnhub.io/api/v1${url}?token=${apiKey}`;

        if (params) {
            for (let key in params) {
                baseUrl += `&${key}=${params[key]}`;
            }
        }

        return baseUrl;
    }

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = month + ' ' + date + ', ' + year;
        return time;
      }

    function round (num) {
        return Math.round((num + Number.EPSILON) * 100) / 100
    }

    function unix (time) {  
        return Math.round(time/1000);
    }
    
}

module.exports = fiinhub;