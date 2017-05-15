
import {getSavedUser} from 'client-admin/util/auth';

const savedUser = getSavedUser();

let ws = null;

export function connectSocket() {

    return new Promise((resolve, reject) => {
        if(!savedUser) resolve({});
        const token = savedUser.token;

        ws = new WebSocket(`${process.env.WS_PROTOCOL}://${process.env.WS_HOST}:${process.env.WS_PORT}?token=${token}`);

        ws.onopen = function() {
            console.log('socket open');
        };

        ws.onerror = function(err) {
            console.error(err);
            reject(err);
        }


        ws.onclose = function() {
            console.log('socket closed');
        }

        ws.onmessage = function(event) {
            const message = JSON.parse(event.data);

            if(message.type === 'INITIAL_STATE') {
                resolve(message.payload);
            }
        };


    });

    

}

// let listeners = [];
// let ws = null;

// function initSocket(token) {

//     ws = new WebSocket(`${process.env.WS_PROTOCOL}://${process.env.WS_HOST}:${process.env.WS_PORT}?token=${token}`);

//     ws.onopen = function() {
//         console.log('socket open');
//     };

//     ws.onclose = function() {
//         console.log('socket closed');
//     }

//     ws.onmessage = function(event) {
//         const message = JSON.parse(event.data);
//         const toNotify = listeners.filter(listener =>
//             listener.event === message.event &&
//             (!listner.matcher || listener.matcher(message))
//         );

//         toNotify.forEach(listener => listener.handler(message));
//     };
// }

// if(savedUser && savedUser.token) {
//     initSocket(savedUser.token);
// }


// export function listen(event, matcher, handler) {
//     listeners.push({event, matcher, handler});

//     // If not already listening, start
//     if(!ws) {
//         const savedUser = getSavedUser();
//         if(savedUser && savedUser.token) {
//             initSocket(savedUser.token);
//         }
//     }
// }

// export function unlisten(event, handler) {
//     listeners = listeners.filter(
//         listener => listener.event !== event || listener.handler !== handler
//     );
// };

export function closeSocket() {
    ws.close();
    ws = null;
};