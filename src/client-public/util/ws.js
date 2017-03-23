
import {getSavedUser} from 'client-public/util/auth';

const savedUser = getSavedUser();

let listeners = [];
let ws = null;

function initSocket(token) {

    ws = new WebSocket(`${process.env.WS_PROTOCOL}://${process.env.WS_HOST}:${process.env.WS_PORT}?token=${token}`);

    ws.onopen = function() {
        console.log('socket open');
    };

    ws.onclose = function() {
        console.log('socket closed');
    }

    ws.onmessage = function(event) {
        const message = JSON.parse(event.data);
        const toNotify = listeners.filter(listener =>
            listener.event === message.event &&
            (!listner.matcher || listener.matcher(message))
        );

        toNotify.forEach(listener => listener.handler(message));
    };
}

if(savedUser && savedUser.token) {
    initSocket(savedUser.token);
}


export function listen(event, matcher, handler) {
    listeners.push({event, matcher, handler});

    // If not already listening, start
    if(!ws) {
        const savedUser = getSavedUser();
        if(savedUser && savedUser.token) {
            initSocket(savedUser.token);
        }
    }
}

export function unlisten(event, handler) {
    listeners = listeners.filter(
        listener => listener.event !== event || listener.handler !== handler
    );
};

export function closeSocket() {
    listeners = [];
    if(ws) {
        ws.close();
        ws = null;
    }
};