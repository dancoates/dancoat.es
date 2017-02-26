import Hapi from 'hapi';
import {graphql} from 'graphql';
import {Resolver, Schema} from 'api';
import Boom from 'boom';
import ReactDOMServer from 'react-dom/server'
import {Provider} from 'react-redux';
import store from 'client/store';
import React from 'react';
import { RouterContext, match } from 'react-router';
import Index from 'client/index.static';
import routes from 'client/routes';
import upload from 'server/upload';

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

        // Don't server side render admin paths
        const isAdminPath = path.match(/^\/login\/?$/) ||
                            path.match(/^\/logout\/?$/) ||
                            path.match(/^\/admin(\/|$)/);

        match({routes, location: path}, (err, redirect, renderProps) => {
            if(err) {
                return reply(Boom.wrap(err));
            } else if(redirect) {
                return reply.redirect(redirect.pathname + redirect.search);
            } else if(renderProps) {
                const content = !isAdminPath ? ReactDOMServer.renderToString(
                    <Provider store={store}><RouterContext {...renderProps}/></Provider>
                ) : '';

                const wrapper = <Index content={content}/>
                return reply(ReactDOMServer.renderToString(wrapper));
            } else {
                return reply(Boom.notFound('Requested thingo not found', {path}));
            }
        });        
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

        const response = new Promise((resolve, reject) => {
            graphql(Schema, query, Resolver, context, variables).then((result) => {
                resolve(result);
            });
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
            parse: true,
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