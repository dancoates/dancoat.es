// Individual schemas
export {default as post} from 'api/types/post/PostSchema.graphql';
export {default as postVersion} from 'api/types/post/PostVersionSchema.graphql';
export {default as user} from 'api/types/user/UserSchema.graphql';


// Root query schema
export default `
    type Query {
        post: Post,
        postList: [Post],
        user: UserQuery
    }

    type Mutation {
        user: UserMutation
    }
`;