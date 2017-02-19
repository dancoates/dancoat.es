import {graphqlApi} from 'client/config/paths';
import loginQuery from 'client/queries/login.graphql';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';


export function login({username, password}) {
    console.log(username, password);

    return function(dispatch) {
        dispatch({
            type: LOGIN_REQUEST,
            payload: {
                username: username
            }
        });
        console.log({
                query: loginQuery,
                variables: {
                    username,
                    password
                }
            });
        fetch(graphqlApi, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                query: loginQuery,
                variables: {
                    username,
                    password
                }
            })
        }).then(result => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        });

    }
};
