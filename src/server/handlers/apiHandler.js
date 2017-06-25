//@flow
import {graphql} from 'graphql';
import {Resolver, Schema} from 'server/graphql';
import Request from 'hapi/lib/request';
import Reply from 'hapi/lib/request';

export default function(request: Request, reply: Reply): void {
    const query = request.payload.query;
    const variables = typeof request.payload.variables === 'string'
        ? JSON.parse(request.payload.variables)
        : request.payload.variables;

    const context = {request};

    const response = graphql(Schema, query, Resolver, context, variables)
        .then((result: Object): Object => {
            if(result.errors) {
                result.errors.forEach(error => console.error(error.stack));
            }
            return result;
        });

    return reply(response);
}