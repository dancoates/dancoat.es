import auth from 'admin/reducers/auth';
import user from 'admin/reducers/user';
import upload from 'admin/reducers/upload';

export default function(state= {}, action) {
    
    return {
        upload: upload(state.upload, action),
        auth: auth(state.auth, action),
        user: user(state.user, action)
    };
}