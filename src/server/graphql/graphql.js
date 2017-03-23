import {buildSchema} from 'graphql';
import {fromJS} from 'immutable';
import rootQuerySchema, * as schemas from 'server/graphql/schemas';
import * as resolvers from 'server/graphql/resolvers';

const schemaMap = fromJS(schemas);
export const Schema = buildSchema(schemaMap.join('\n') + rootQuerySchema);
export const Resolver = resolvers;