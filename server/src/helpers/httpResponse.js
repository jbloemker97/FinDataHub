function httpResponse ({ success, statusCode, data, clientMessage, headers = null }) {

    return Object.freeze({
        success,
        statusCode,
        data,
        clientMessage,
        headers
    })
}

module.exports = httpResponse;