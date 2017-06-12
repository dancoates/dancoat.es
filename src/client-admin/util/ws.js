
import {getSavedUser} from 'util/auth';
import {
    READY,
    CONNECTING,
    NOT_SETUP
} from 'client-admin/constants/wsStates';
//@TODO export singleton that knows has onMessage and send attributes and queue any messages until ready

let status = NOT_SETUP;
let queue = [];
let ws = null;
let callbacks = [];

function setup() {
    if(status !== NOT_SETUP) return;

    const savedUser = getSavedUser();
    if(!savedUser) return;

    status = CONNECTING;

    const token = savedUser.token;

    ws = new WebSocket(`${process.env.WS_PROTOCOL}://${process.env.WS_HOST}:${process.env.WS_PORT}?token=${token}`);

    ws.onopen = function() {
        status = READY;
        if(queue.length > 0) {
            queue.forEach(message => ws.send(JSON.stringify(message)));
        }
    };

    ws.onmessage = function(message) {
        const data = JSON.parse(message);
        if(data.type !== 'action') return;

        callbacks.forEach(callback => {
            callback(data);
        });
    };


    ws.onclose = function() {
        console.log('socket closed');
    };

}


//@TODO add unlisten?
export function onMessage(callback) {
    if(status === NOT_SETUP) {
        setup();
    }
    callbacks.push(callback);
}

export function sendMessage(message) {
    if(status === NOT_SETUP) {
        setup();
        queue.push(message);
    }

    if(status === READY) {
        ws.send(JSON.stringify(message));
    }

    if(status === CONNECTING) {
        queue.push(message);
    }
}

export function connectSocket() {
    if(status === NOT_SETUP) setup();
}

export function closeSocket() {
    ws.close();
    ws = null;
};