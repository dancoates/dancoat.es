import {graphqlApi} from 'client/config/paths';
import loginQuery from 'client/queries/login.graphql';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';


export function login({email, password}) {

    return function(dispatch) {
        dispatch({
            type: LOGIN_REQUEST,
            payload: {
                email: email
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
                    email,
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
