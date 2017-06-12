// Individual schemas
export {default as post} from 'types/post/PostSchema.graphql';
export {default as postVersion} from 'types/post/PostVersionSchema.graphql';
export {default as user} from 'types/user/UserSchema.graphql';


// Root query schema
export default `
    type Query {
        post: Post,
        postList: [Post],
        user: UserQuery
    }
`;