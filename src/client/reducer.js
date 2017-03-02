import auth from 'client/reducers/auth';
import user from 'client/reducers/user';
import upload from 'client/reducers/upload';

export default function(state= {}, action) {
    
    return {
        upload: upload(state.upload, action),
        auth: auth(state.auth, action),
        user: user(state.user, action)
    };
}