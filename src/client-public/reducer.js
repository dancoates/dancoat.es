import auth from 'client-public/reducers/auth';
import user from 'client-public/reducers/user';
import upload from 'client-public/reducers/upload';

export default function(state= {}, action) {
    
    return {
        upload: upload(state.upload, action),
        auth: auth(state.auth, action),
        user: user(state.user, action)
    };
}