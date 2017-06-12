import {hydrateEndpoint} from 'config/paths';
import {getSavedUser, removeSavedUser} from 'util/auth';

export default function() {
    const savedUser = getSavedUser();

    if(!savedUser) return Promise.reject(new Error('Not logged in'));

    return fetch(hydrateEndpoint, {
        method: 'GET',
        headers: {
            'Authorization': savedUser ? savedUser.token : ''
        },
        mode: 'cors'
    })
        .then(result => {
            if(result.status === 401) removeSavedUser();
            if(result.status !== 200) throw new Error(result.statusText);
            return result.json();
        });
}
