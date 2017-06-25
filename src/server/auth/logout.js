// @flow
import pg from 'services/postgres';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import Boom from 'boom';
import Request from 'hapi/lib/request';

export default function(request: Request): Promise<{success: bool}> {
    const token = request.headers.authorization;
    if(!token) return Promise.reject(Boom.unauthorized('Token not found'));

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const time = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    return pg.query(
        `
        update session
        set valid = false, modified = $[time]
        where id = $[sessionId]
        `,
        {
            sessionId: payload.sessionId,
            time
        }
    ).then(() => ({success: true}));
}