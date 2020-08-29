const { Client } = require('pg');
const { pgHost, pgUser, pgPassword, pgDatabase, pgPort } = require('../config/');

function makeDb () {
    const client = new Client({
        user: pgUser,
        host: pgHost,
        database: pgDatabase,
        password: pgPassword,
        port: pgPort,
      })

      client.connect();

      return client;
}

module.exports = makeDb;