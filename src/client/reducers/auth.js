import * as authActions from 'client/actions/auth';
import AuthRecord from 'client/records/AuthRecord';
import {getSavedUser} from 'client/util/auth';

const savedUser = getSavedUser();
const initialState = new AuthRecord({
    token: savedUser ? savedUser.token : null,
    loggedIn: savedUser ? !!savedUser.token : false,
    loggedOut: savedUser ? !savedUser.token : true
});

export default function(state = initialState, action) {

    switch(action.type) {
        case authActions.LOGIN_REQUEST:
            return state.merge({
                loginRequest: true
            });

        case authActions.LOGIN_SUCCESS:
            return state.merge({
                loggedIn: true,
                loggedOut: false,
                loginRequest: false,
                token: action.payload.token
            });

        case authActions.LOGIN_FAILURE:
            return state.merge({
                loginRequest: false,
                loginError: action.payload
            });

        case authActions.LOGOUT_REQUEST:
            return state.merge({
                logoutRequest: true
            });

        case authActions.LOGOUT_SUCCESS:
            return state.merge({
                loggedIn: false,
                loggedOut: true,
                logoutRequest: false
            });

        case authActions.LOGOUT_FAILURE:
            return state.merge({
                logoutRequest: false,
                logoutError: action.payload
            });
    }

    return state;
}