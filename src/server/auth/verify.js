// @flow

import jwt from 'jsonwebtoken';
import pg from 'services/postgres';
import type {SessionMeta} from 'types/definitions';

const verifyJWT = (token) => new Promise((resolve: Function, reject: Function) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err: Error, decoded: SessionMeta): void => {
        if(err) return reject(err);
        resolve(decoded);
    });
});

const checkSession = (payload) => new Promise((
    resolve: Function,
    reject: Function
): Promise<SessionMeta> => {
    return pg.query(
        `select valid from session where id = $[sessionId]`,
        {sessionId: payload.sessionId}
    )
        .then((rows: Array<Object>) => {
            if(rows.length === 1 && rows[0].valid === true) {
                resolve(payload);
            } else {
                reject(new Error('Session invalid')); // @TODO better http error using boom?
            }
        });
});

 
export default function(token: string): Promise<SessionMeta> {
    return verifyJWT(token)
        .then(checkSession);
}