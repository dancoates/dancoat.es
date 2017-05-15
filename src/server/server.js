import Hapi from 'hapi';
import {graphql} from 'graphql';
import {Resolver, Schema} from 'server/graphql';
import verify from 'server/auth/verify';
import Boom from 'boom';
import ReactDOMServer from 'react-dom/server'
import {Provider} from 'react-redux';
import path from 'path';
import store from 'admin/store';


import React from 'react';
import {StaticRouter} from 'react-router-dom';

import ClientPublicStore from 'client-public/store';
import ClientPublicIndex from 'client-public/index.static';
import ClientPublicApp from 'client-public/components/App';

import ClientAdminIndex from 'client-admin/index.static';

import upload from 'server/upload';
import WebSocket from 'ws';
import url from 'url';


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

        const response = graphql(Schema, query, Resolver, context, variables).then(result => {
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

const stores = {};

wss.on('connection', function connection(ws) {
    const reqUrl = url.parse(ws.upgradeReq.url, true);
    const token = reqUrl.query.token;

    verify(token)
        .then(session => {
            stores[session.userId] = stores[session.userId] || store();

            stores[session.userId].dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {token}
            });

            const payload = {
                type: 'INITIAL_STATE',
                payload: stores[session.userId].getState()
            };

            ws.send(JSON.stringify(payload));
        });

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
});
