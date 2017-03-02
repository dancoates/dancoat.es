import graphql from 'client/util/graphql';
import loginQuery from 'client/queries/login.graphql';
import logoutQuery from 'client/queries/logout.graphql';
import {saveUser, removeSavedUser} from 'client/util/auth';
import {closeSocket} from 'client/util/ws';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export function login({email, password}) {

    return function(dispatch) {
        dispatch({
            type: LOGIN_REQUEST,
            payload: {
                email: email
            }
        });

        graphql(loginQuery, {email, password})
            .then((data) => {
                saveUser(data.user.login);
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: data.user.login
                });
            })
            .catch((err) => {
                dispatch({
                    type: LOGIN_FAILURE,
                    payload: err
                });
            });

    }
};


export function logout() {  
    return function(dispatch) {
        dispatch({type: LOGOUT_REQUEST});
        closeSocket();
        graphql(logoutQuery)
            .then((data) => {
                removeSavedUser();
                dispatch({type: LOGOUT_SUCCESS});
            })
            .catch((err) => dispatch({type: LOGOUT_FAILURE, payload: err}));
    };
}