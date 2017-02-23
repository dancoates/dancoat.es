import auth from 'client/reducers/auth';

export default function(state= {}, action) {
    
    return {
        auth: auth(state.auth, action)
    };
}