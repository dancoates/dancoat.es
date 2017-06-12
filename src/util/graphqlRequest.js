import {graphqlEndpoint} from 'config/paths';
import {getSavedUser} from 'util/auth';

// @TODO don't dupe saved user stuff ehre.
export default function(query, variables) {
    const savedUser = getSavedUser();

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