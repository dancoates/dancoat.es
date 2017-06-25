// @flow
import WebSocket from 'ws/lib/WebSocket';

export type {WebSocket as WebSocket};


// Data Flow
export type Action = {
    type: string,
    payload: Object
};



// Sessions
export type SessionMeta = {
    sessionId: string,
    userId: string
};

export type Session = {
    clients: Array<WebSocket>,
    store: Function,
    meta: SessionMeta
};


// User Stuff