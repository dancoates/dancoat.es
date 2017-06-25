// @flow

import Hapi from 'hapi';

import uploadHandler from 'server/handlers/uploadHandler';
import {adminRenderHandler, publicRenderHandler} from 'server/handlers/ssrHandler';
import hydrateHandler from 'server/handlers/hydrateHandler';
import apiHandler from 'server/handlers/apiHandler';
import {loginHandler, logoutHandler} from 'server/handlers/authHandler';


///
//  HTTP Server
///

const server = new Hapi.Server();

server.connection({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.SERVER_PORT || 4444
});


// Public client server side rendering
server.route({
    method: 'GET',
    path: '/{p*}',
    handler: publicRenderHandler
});


// Admin client server side rendering
server.route({
    method: 'GET',
    path: '/admin/{p*}',
    handler: adminRenderHandler
});


// Authentication routes
server.route({
    method: 'POST',
    path: '/login',
    config: {
        cors: true
    },
    handler: loginHandler
});


server.route({
    method: 'POST',
    path: '/logout',
    config: {
        cors: true
    },
    handler: logoutHandler
});

server.route({
    method: 'POST',
    path: '/api',
    config: {
        cors: true
    },
    handler: apiHandler
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
    handler: uploadHandler
});

server.route({
    method: 'GET',
    path: '/hydrate',
    config: {
        cors: true
    },
    handler: hydrateHandler
});


// Start the server
server.start((err: Error) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});




