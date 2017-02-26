import auth from 'client/reducers/auth';
import user from 'client/reducers/user';

export default function(state= {}, action) {
    
    return {
        auth: auth(state.auth, action),
        user: user(state.user, action)
    };
}