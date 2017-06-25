// @flow
import Boom from 'boom';
import verify from 'server/auth/verify';
import Request from 'hapi/lib/request';
import Reply from 'hapi/lib/request';
import {getSession} from 'server/session';

export default async function(request: Request, reply: Reply): Promise<void> {
    const token = request.headers.authorization;

    try {
        const sessionMeta = await verify(token);
        const session = getSession(token, sessionMeta);
        reply(session.store.getState());
    } catch(err) {
        reply(Boom.unauthorized(err.message));
    }
}