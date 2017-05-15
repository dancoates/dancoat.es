import jwt from 'jsonwebtoken';
import {query} from 'services/postgres';
import pg from 'services/postgres';


const verifyJWT = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err) return reject(err);
        resolve(decoded);
    });
});

const checkSession = (payload) => new Promise((resolve, reject) => {
    return pg.query(
        `select valid from session where id = $[sessionId]`,
        {sessionId: payload.sessionId}
    )
        .then(rows => {
            if(rows.length === 1 && rows[0].valid === true) {
                resolve(payload);
            } else {
                reject(new Error('Session invalid')); // @TODO better http error using boom?
            }
        });
});

 
export default function(token) {
    return verifyJWT(token)
        .then(checkSession);
};