const pg = require('pg');


const config = {
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    max: 10,
    idleTimeoutMillis: 30000
};

const pool = new pg.Pool(config);

export const query = (query) => (new Promise((resolve, reject) => {
    pool.connect(function(err, client, done) {
        if(err) {
            console.error('error fetching client from pool', err);
            return reject(err);
        }

        client.query(query, function(err, result) {
            done(err);

            if(err) {
                console.error('error running query', err);
                return reject(err);
            }

            resolve(result);
        });
    })
}));

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack)
})