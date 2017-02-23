import * as authActions from 'client/actions/auth';
import AuthRecord from 'client/records/AuthRecord';

const rawSavedUser = typeof window === 'object' ? window.localStorage.getItem('user') : null;
const savedUser = rawSavedUser ? JSON.parse(rawSavedUser) : {};

const initialState = new AuthRecord({
    token: savedUser.token,
    loggedIn: !!savedUser.token,
    loggedOut: !savedUser.token
});

export default function(state = initialState, action) {

    switch(action.type) {
        case authActions.LOGIN_REQUEST:
            return state.merge({loginRequest: true});
        case authActions.LOGIN_SUCCESS:
            return state.merge({
                loggedIn: true,
                loggedOut: false,
                loginRequest: false,
                token: action.payload.token
            });
        case authActions.LOGIN_FAILURE:
            return state.merge({loginRequest: false, loginError: action.payload});
        case authActions.LOGOUT_REQUEST:
            return state.merge({logoutRequest: true});
        case authActions.LOGOUT_SUCCESS:
            return state.merge({loggedIn: false, loggedOut: true, logoutRequest: false});
        case authActions.LOGOUT_FAILURE:
            return state.merge({logoutRequest: false, logoutError: action.payload});
    }

    return state;
}