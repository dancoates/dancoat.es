//@flow
// Individual schemas
import post from '../../types/post/PostSchema.graphql';
export {post as post};
import postVersion from '../../types/post/PostVersionSchema.graphql';
export {postVersion as postVersion};
import user from '../../types/user/UserSchema.graphql';
export {user as user};


// Root query schema
export default `
    type Query {
        post: Post,
        postList: [Post],
        user: UserQuery
    }
`;