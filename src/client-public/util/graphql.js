import {graphqlEndpoint} from 'config/paths';

export default function(query, variables) {
    const rawSavedUser = typeof window === 'object' ? window.localStorage.getItem('user') : null;
    const savedUser = rawSavedUser ? JSON.parse(rawSavedUser) : null;

    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    return fetch(graphqlEndpoint, {
        method: 'POST',
        headers: Object.assign({}, headers, savedUser ? {
            'Authorization': savedUser.token
        } : {}),
        mode: 'cors',
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    })
    .then(result => result.json())
    .then(result => result.data);
}