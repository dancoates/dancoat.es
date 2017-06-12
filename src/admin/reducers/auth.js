import * as authActions from 'client-admin/actions/auth';
import AuthRecord from 'types/auth/AuthRecord';
import {getSavedUser} from 'util/auth';

import {
    LOGGED_OUT,
    LOGGED_IN,
    LOGGING_IN
} from 'client-admin/constants/authStates';


const savedUser = getSavedUser();

const initialState = new AuthRecord({
    token: savedUser ? savedUser.token : null,
    status: savedUser && !!savedUser.token ? LOGGED_IN : LOGGED_OUT
});

export default function(state = initialState, action) {

    switch(action.type) {
        case authActions.LOGIN_REQUEST:
            return state.merge({
                status: LOGGING_IN
            });

        case authActions.LOGIN_SUCCESS:
            return state.merge({
                status: LOGGED_IN,
                token: action.payload.token
            });

        case authActions.LOGIN_FAILURE:
            return state.merge({
                status: LOGGED_OUT,
                error: action.payload
            });

        case authActions.LOGOUT_REQUEST:
            return state.merge({
                status: LOGGING_IN
            });

        case authActions.LOGOUT_SUCCESS:
            return state.merge({
                status: LOGGED_OUT,
                error: false
            });

        case authActions.LOGOUT_FAILURE:
            return state.merge({
                error: action.payload
            });
    }

    return state;
}