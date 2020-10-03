const express = require('express');
const router = express.Router();
const Controller = require('./data-controller')();

router.get('/gap-stats/:ticker', async function (req, res) {
    let response = await Controller.getGapStats({ ticker: req.params.ticker });

    // Set Headers
    if (response.headers) {
        res.set(response.headers);
    }

    // Send Reponse
    res.status(response.statusCode).send(response);
});

router.get('/momo-stats/:ticker', async function (req, res) {
    let response = await Controller.getMomoStats({ ticker: req.params.ticker });

    // Set Headers
    if (response.headers) {
        res.set(response.headers);
    }

    // Send Reponse
    res.status(response.statusCode).send(response);
});

router.get('/vf/:ticker', async function (req, res) {
    let response = await Controller.getVolumeForecast({ ticker: req.params.ticker });

    // Set Headers
    if (response.headers) {
        res.set(response.headers);
    }

    // Send Reponse
    res.status(response.statusCode).send(response);
});

router.get('/filings/:ticker', async function (req, res) {
    let response = await Controller.getFilings({ ticker: req.params.ticker });

    // Set Headers
    if (response.headers) {
        res.set(response.headers);
    }

    // Send Reponse
    res.status(response.statusCode).send(response);
});

module.exports = router;