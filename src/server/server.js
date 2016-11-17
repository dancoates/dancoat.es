require('dotenv').config({silent: true});

import Hapi from 'hapi';
import {graphql} from 'graphql';
import {Resolver, Schema} from 'api';

const server = new Hapi.Server();

server.connection({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000
});

server.route({
    method: 'POST',
    path: '/api',
    handler: function(request, reply) {
        const query = request.payload.query;
        const variables = request.payload.variables;
        
        const response = new Promise((resolve, reject) => {
            graphql(Schema, query, Resolver, variables).then((result) => {
                resolve(result);
            });
        });

        return reply(response);
    }
});

// Start the server
server.start((err) => {
    if (err) throw err;
    console.log('Server running at:', server.info.uri);
});