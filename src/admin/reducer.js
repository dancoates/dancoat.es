import auth from 'client-admin/reducers/auth';
import user from 'client-admin/reducers/user';
import upload from 'client-admin/reducers/upload';

export default function(state= {}, action) {
    
    return {
        upload: upload(state.upload, action),
        auth: auth(state.auth, action),
        user: user(state.user, action)
    };
}