import jwt from 'jsonwebtoken';
import {query} from 'services/postgres';
import SQL from 'sql-template-strings';
import moment from 'moment';


export default function(request) {
    const token = request.headers.authorization;
    if(!token) throw new Error('Token not found');

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const time = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    return query(SQL`
        update session
        set valid = false, modified = ${time}
        where id = ${payload.sessionId}
    `).then(() => 'success');
}