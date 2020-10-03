const { iexKey, secApiKey, finnhubApiKey, fmpApiKey } = require('../config');
const iex = require('./iexCloud/iex-service')(iexKey);
const sec = require('./secApi/secApi-service')(secApiKey);
const finnhub = require('./finnhub/finnhub-service')(finnhubApiKey);
const fmp = require('./fmp/fmp-service')(fmpApiKey);
const httpResponse = require('../helpers/httpResponse');


function Controller () {
    return Object.freeze({
        getGapStats,
        getFilings,
        getMomoStats,
        getVolumeForecast
    }); 

    async function getGapStats ({ ticker }) {
        try {
            const data = await finnhub.getGapStats({ ticker });
            // const data = await fmp.gapStats({ ticker });

            return httpResponse({ 
                success: true,
                statusCode: 200,
                data,
                clientMessage: 'Success!'
            });
        }catch (error) {
            return httpResponse({
                success: false,
                statusCode: 400,
                data: error.message,
                clientMessage: 'Error. Could not get gap stats'
            });
        }
    }

    async function getMomoStats ({ ticker }) {
        try {
            const data = await finnhub.getMomoStats({ ticker });

            return httpResponse({ 
                success: true,
                statusCode: 200,
                data,
                clientMessage: 'Success!'
            });
        }catch (error) {
            return httpResponse({
                success: false,
                statusCode: 400,
                data: error.message,
                clientMessage: 'Error. Could not get momo stats'
            });
        }
    }

    async function getVolumeForecast ({ ticker }) {
        try {
            const data = await finnhub.getVolumeForecast({ ticker });

            return httpResponse({ 
                success: true,
                statusCode: 200,
                data,
                clientMessage: 'Success!'
            });
        }catch (error) {
            return httpResponse({
                success: false,
                statusCode: 400,
                data: error.message,
                clientMessage: 'Error. Could not get VF'
            });
        }
    }

    async function getFilings ({ ticker }) {
        try {
            const data = await finnhub.getFilings({ ticker });

            return httpResponse({ 
                success: true,
                statusCode: 200,
                data,
                clientMessage: 'Success!'
            });
        }catch (error) {
            return httpResponse({
                success: false,
                statusCode: 400,
                data: error.message,
                clientMessage: 'Error. Could not get filings'
            });
        }
    }
}

module.exports = Controller;