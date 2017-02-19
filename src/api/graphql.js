import {buildSchema} from 'graphql';
import {fromJS} from 'immutable';
import rootQuerySchema, * as schemas from 'api/schemas';
import * as resolvers from 'api/resolvers';

const schemaMap = fromJS(schemas);
export const Schema = buildSchema(schemaMap.join('\n') + rootQuerySchema);
export const Resolver = resolvers;