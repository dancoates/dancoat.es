// Individual schemas
export {default as post} from 'api/post/PostSchema.graphql';
export {default as postVersion} from 'api/post/PostVersionSchema.graphql';
export {default as account} from 'api/account/AccountSchema.graphql';


// Root query schema
export default `
    type Query {
        post: Post,
        postList: [Post],
        account: Account
        accountList: [Account]
    }
`;