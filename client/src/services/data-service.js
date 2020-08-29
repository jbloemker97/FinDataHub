import axios from 'axios';

function getGapStats ({ ticker }) {
    const url = `http://localhost:5000/data/gap-stats/${ticker}`; // Change in prod

    return axios.get(url).then(response => response.data);

}

function getFundementals ({ ticker }) {
    const url = `http://localhost:5000/data/filing-data/${ticker}`;

    return axios.get(url).then(response => response.data);
}

function getStockData ({ ticker }) {
    const url = `http://localhost:5000/data/${ticker}`;

    return axios.get(url).then(response => response.data);
}

function getFilings ({ ticker }) {
    const url = `http://localhost:5000/data/filings/${ticker}`;

    return axios.get(url).then(response => response.data);
}

export {
    getGapStats,
    getFundementals,
    getStockData,
    getFilings
}