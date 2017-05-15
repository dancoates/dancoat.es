import pg from 'services/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';



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
    console.log(user, session);
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
    .then((user) => user, (err) => {throw new Error('Incorrect email or password')})
    .then((user) => checkUserPassword(user, password))
    .then((user) => createNewSession(user, request))
    .then(({user, session}) => console.log(user, session) || getToken(user, session));
}

