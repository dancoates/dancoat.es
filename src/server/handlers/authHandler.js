//@flow
import Boom from 'boom';
import login from 'server/auth/login';
import logout from 'server/auth/logout';
import Request from 'hapi/lib/request';
import Reply from 'hapi/lib/request';


export function loginHandler(request: Request, reply: Reply) {
    const {email, password} = request.payload;
    login(email, password, request)
        .then(reply)
        .catch((err: Error): void => {
            console.error(err);
            if(err.isBoom) return reply(err);
            reply(Boom.wrap(err));
        });
}

export function logoutHandler(request: Request, reply: Reply) {
    logout(request)
        .then(reply)
        .catch((err: Error): void => {
            console.error(err);
            if(err.isBoom) return reply(err);
            reply(Boom.wrap(err));
        });
}