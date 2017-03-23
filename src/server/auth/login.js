import {query} from 'services/postgres';
import SQL from 'sql-template-strings';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';


const getUserFromResult = (result) => {
    if(result && result.rows && result.rows.length === 1) {
        return result.rows[0];
    } else {
        throw new Error('Incorrect email or password');
    }
};

const checkUserPassword = (user, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, function(err, res) {
            if(err) return reject(err);
            if(res) {
                return resolve(user);
            } else {
                return reject(new Error('Incorrect email or password'));
            }
        });
    });
};

const createNewSession = (user, request) => {
    const userAgent = request.headers['user-agent'];
    const host = request.headers['host'];
    const ip = request.info.remoteAddress;
    const time = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    return query(SQL`
        insert into session
        (valid, account, ip, user_agent, created, modified, host)
        values (true, ${user.id}, ${ip}, ${userAgent}, ${time}, ${time}, ${host})
        returning id
    `).then((sessionResult) => {
        if(sessionResult.rows && sessionResult.rows.length === 1 && sessionResult.rows[0].id) {
            return {
                user,
                session: sessionResult.rows[0].id
            };
        }
    });
};

const getToken = (user, session) => {
    const token = jwt.sign(
        {
            sessionId: session,
            userId: user.id
        },
        process.env.JWT_SECRET_KEY
    );

    return {...user, token};
};


export default function(email, password, request) {
    if(!email || !password) throw new Error('email or password not provided');

    return query(SQL`
        select
            id,
            name,
            role,
            email,
            password,
            created,
            modified
        from account
        where email = ${email}
    `)
    .then(getUserFromResult)
    .then((user) => checkUserPassword(user, password))
    .then((user) => createNewSession(user, request))
    .then(({user, session}) => getToken(user, session));
}

