// @flow

import pg from 'services/postgres';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Boom from 'boom';
import Request from 'hapi/lib/request';
import uuid from 'uuid/v4';

type UserData = {
    id: string,
    name: string,
    role: string,
    email: string,
    password: string,
    created: string,
    modified: string,
    token: string
};

const checkUserPassword = (user: UserData, password: string): Promise<bool> => {
    return new Promise((resolve: Function, reject: Function) => {
        bcrypt.compare(password, user.password, function(err: Error, res: bool): void {
            if(err) return reject(err);
            return resolve(res);
        });
    });
};

const createNewSession = async (
    user: UserData,
    request: Request
): Promise<string> => {
    const userAgent = request.headers['user-agent'];
    const host = request.headers['host'];
    const ip = request.info.remoteAddress;
    const sessionData = await pg.one(
        `
            insert into session
            (id, valid, account, ip, user_agent, created, modified, lastactive, host)
            values ($[id], true, $[userId], $[ip], $[userAgent], $[time], $[time], $[time], $[host])
            returning id
        `,
        {
            id: uuid(),
            userId: user.id,
            time: new Date(),
            userAgent,
            host,
            ip
        }
    );

    return sessionData.id;
};

const getToken = (user: UserData, session: string): UserData => {
    const token = jwt.sign(
        {
            sessionId: session,
            userId: user.id
        },
        process.env.JWT_SECRET_KEY
    );

    return {...user, token};
};


export default async function(email: string, password: string, request: Request): Promise<UserData> {
    if(!email || !password) throw Boom.unauthorized('email or password not provided');

    const err = Boom.unauthorized('Incorrect email or password');

    const userData = await pg.oneOrNone(
        `
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
        `,
        {email}
    );

    if(!userData) throw err;

    const validPassword = await checkUserPassword(userData, password);
    if(!validPassword) throw err;


    const sessionId = await createNewSession(userData, request);
    const userDataWithToken = await getToken(userData, sessionId);

    return userDataWithToken;
}

