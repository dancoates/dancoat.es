import pg from 'services/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import Boom from 'boom';


const checkUserPassword = (user, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, function(err, res) {
            if(err) return reject(err);
            if(res) {
                delete user.password;
                return resolve(user);
            } else {
                return reject(Boom.unauthorized('Incorrect email or password'));
            }
        });
    });
};

const createNewSession = (user, request) => {
    const userAgent = request.headers['user-agent'];
    const host = request.headers['host'];
    const ip = request.info.remoteAddress;
    const time = moment.utc().format('YYYY-MM-DD HH:mm:ss');


    return pg.one(`
        insert into session
        (valid, account, ip, user_agent, created, modified, host)
        values (true, $[userId], $[ip], $[userAgent], $[time], $[time], $[host])
        returning id
    `, {
        userId: user.id,
        ip,
        userAgent,
        time,
        host
    }).then((session) => ({
        user,
        session: session.id
    }));
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
    if(!email || !password) return Promise.reject(Boom.unauthorized('email or password not provided'));

    return pg.one(`
        select
            id,
            name,
            role,
            email,
            password,
            created,
            modified
        from account
        where email = $[email]
    `, {email})
    .then((user) => user, (err) => Promise.reject(Boom.unauthorized('Incorrect email or password')))
    .then((user) => checkUserPassword(user, password))
    .then((user) => createNewSession(user, request))
    .then(({user, session}) => getToken(user, session));
}

