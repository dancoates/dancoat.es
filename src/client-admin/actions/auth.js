import {loginEndpoint, logoutEndpoint} from 'config/paths';
import {getSavedUser, saveUser, removeSavedUser} from 'util/auth';
import {closeSocket, connectSocket} from 'client-admin/util/ws';
import hydrate from 'client-admin/util/hydrate';
import immutablizeState from 'admin/immutablizeState';

import {
    LOGGED_OUT,
    LOGGED_IN,
    LOGGING_IN
} from 'client-admin/constants/authStates';

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

        fetch(loginEndpoint, {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email, password
            })
        })
            .then(result => {
                if(result.status !== 200) throw new Error(result.statusText);
                return result.json();
            })
            .then(user => {
                saveUser(user);

                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user
                });

                connectSocket();

                hydrate()
                    .then((state) => {
                        dispatch({
                            type: 'HYDRATE',
                            payload: immutablizeState(state)
                        });
                    })
                    .catch((err) => {
                        // This shouldn't happen?
                        console.error(err);
                        window.location.reload();
                    })

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
        const savedUser = getSavedUser();
        if(!savedUser) return;
        dispatch({type: LOGOUT_REQUEST});
        closeSocket();
        removeSavedUser();

        fetch(logoutEndpoint, {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: savedUser.token
            }
        })
            .then(result => {
                if(result.status !== 200) throw new Error(result.statusText);
                return result.json();
            })
            .then(() => {
                dispatch({type: LOGOUT_SUCCESS});
            })
            .catch((err) => {
                dispatch({type: LOGOUT_FAILURE, payload: err})
            });
    };
}