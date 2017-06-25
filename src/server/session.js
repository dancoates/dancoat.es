// @flow
import store from 'admin/store';
import type {Action, SessionMeta, Session, WebSocket} from 'types/definitions';


const sessions = {};
export const createSession = (token: string, sessionMeta: SessionMeta): Session => {
    
    const sendMessage = (action: Action) => {
        if(action.secondary || action.type === '@@redux/INIT') return;
        sessions[sessionMeta.userId].clients.forEach((client: WebSocket) => {
            client.send({
                type: 'action',
                payload: {
                    ...action,
                    secondary: true // So that clients don't redispatch
                }
            });
        });
    };

    return {
        clients: [],
        store: store({
            auth: {
                status: 'LOGGED_IN',
                token: token
            }
        }, sendMessage),
        meta: sessionMeta
    };
};


export const getSession = (token: string, sessionMeta: SessionMeta): Session => {
    return sessions[sessionMeta.userId] || createSession(token, sessionMeta);
};