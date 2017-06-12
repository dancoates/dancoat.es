import auth from 'admin/reducers/auth';
import user from 'admin/reducers/user';
import upload from 'admin/reducers/upload';
import {LOGGED_IN} from 'client-admin/constants/authStates';


export default (onAction) => function(state= {}, action) {
    // Allow full replacement of state
    if(action.type === 'HYDRATE') return action.payload;

    // Only send messages if logged in
    if(state.auth.status === LOGGED_IN) {
        onAction(action);
    }

    return {
        upload: upload(state.upload, action),
        auth: auth(state.auth, action),
        user: user(state.user, action)
    };
}