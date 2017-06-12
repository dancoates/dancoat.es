import Hapi from 'hapi';
import {graphql} from 'graphql';
import Boom from 'boom';
import React from 'react';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router-dom';
import path from 'path';
import uuid from 'uuid/v4';
import WebSocket from 'ws';
import url from 'url';

import {Resolver, Schema} from 'server/graphql';
import verify from 'server/auth/verify';
import login from 'server/auth/login';
import logout from 'server/auth/logout';
import upload from 'server/upload';
import ReactDOMServer from 'react-dom/server'
import store from 'admin/store';


import ClientPublicStore from 'client-public/store';
import ClientPublicIndex from 'client-public/index.static';
import ClientPublicApp from 'client-public/components/App';

import ClientAdminIndex from 'client-admin/index.static';



///
//  HTTP Server
///

const server = new Hapi.Server();

server.connection({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.SERVER_PORT || 4444
});



server.route({
    method: 'GET',
    path: '/{p*}',
    handler: function(request, reply) {
        const path = request.path;
        const context = {};

        const content = ReactDOMServer.renderToString(
            <Provider store={ClientPublicStore}>
                <StaticRouter
                    location={path}
                    context={context}
                >
                    <ClientPublicApp/>
                </StaticRouter>
            </Provider>
        );

        const wrapper = <ClientPublicIndex content={content}/>
        return reply(ReactDOMServer.renderToString(wrapper));

    }
});


server.route({
    method: 'GET',
    path: '/admin/{p*}',
    handler: function(request, reply) {
        const wrapper = <ClientAdminIndex content=''/>
        return reply(ReactDOMServer.renderToString(wrapper));
    }
});


server.route({
    method: 'POST',
    path: '/login',
    config: {
        cors: true
    },
    handler: function(request, reply) {
        const {email, password} = request.payload;
        login(email, password, request)
            .then(reply)
            .catch((err) => {
                if(err.isBoom) return reply(err);
                reply(Boom.wrap(err));
            })
    }
});

server.route({
    method: 'POST',
    path: '/logout',
    config: {
        cors: true
    },
    handler: function(request, reply) {

        logout(request)
            .then(reply)
            .catch((err) => {
                if(err.isBoom) return reply(err);
                reply(Boom.wrap(err));
            })
    }
})



server.route({
    method: 'POST',
    path: '/api',
    config: {
        cors: true
    },
    handler: function(request, reply) {
        const query = request.payload.query;
        const variables = typeof request.payload.variables === 'string'
            ? JSON.parse(request.payload.variables)
            : request.payload.variables;

        const context = {request};

        const response = graphql(Schema, query, Resolver, context, variables)
            .then(result => {
                if(result.errors) {
                    result.errors.forEach(error => console.error(error.stack));
                }
                return result;
            });

        return reply(response);
    }
});

server.route({
    method: 'POST',
    path: '/upload',
    config: {
        payload: {
            output: 'stream',
            maxBytes: 1048576000
        }
    },
    handler: upload
});



server.route({
    method: 'GET',
    path: '/hydrate',
    config: {
        cors: true
    },
    handler: async function(request, reply) {
        const token = request.headers.authorization;

        try {
            const sessionData = await verify(token);
            sessions[sessionData.userId] = sessions[sessionData.userId] || createSession(token, sessionData);
            reply(sessions[sessionData.userId].store.getState());
            
        } catch(err) {
            reply(Boom.unauthorized(err.message));
        }


    }
});


// Start the server
server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});


///
//  Websocket Server
///

const wss = new WebSocket.Server({
    host: process.env.WS_HOST || 'localhost',
    port: process.env.WS_PORT || 7777,
    verifyClient: ({req, secure}, callback) => {
        const reqUrl = url.parse(req.url, true);
        const token = reqUrl.query.token;

        verify(token)
            .then(() => callback(true))
            .catch(() => callback(false));

    }
});


const sessions = {};
const createSession = (token, sessionData) => {
    
    const sendMessage = (action) => {
        if(action.secondary || action.type === '@@redux/INIT') return;
        console.log(action);
        sessions[sessionData.userId].clients.forEach(client => {
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
        data: sessionData
    };
};

wss.on('connection', async function connection(ws) {
    const reqUrl = url.parse(ws.upgradeReq.url, true);
    const token = reqUrl.query.token;
    const clientId = uuid();

    const sessionData = await verify(token);
    sessions[sessionData.userId] = sessions[sessionData.userId] || createSession(token, sessionData);
    // Add client
    sessions[sessionData.userId].clients.push(ws);

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        if(data.type !== 'action') return;

        // Dispatch action
        sessions[sessionData.userId].store.dispatch(data.payload);

        // Broadcast action to all other clients
        sessions[sessionData.userId].clients.forEach(client => {
            if(client === ws) return;

            client.send({
                type: 'action',
                payload: {
                    ...data.payload,
                    secondary: true // So that clients don't redispatch
                }
            });
        });
    });

    ws.on('close', function incoming(message) {
        sessions[sessionData.userId] = {
            ...sessions[sessionData.userId],
            clients: sessions[sessionData.userId].clients.filter(client => client !== ws)
        };
    });

});
