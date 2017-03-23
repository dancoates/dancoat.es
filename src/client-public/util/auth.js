import store from 'client-public/store';
import UserRecord from 'types/user/UserRecord';

export function getSavedUser() {
    const userInState = store && store.getState().user;
    if(userInState) {
        return userInState;
    } else if(typeof window !== 'undefined' && window.localStorage) {
        const rawUser = window.localStorage.getItem('user');
        if(!rawUser) return null;
        return new UserRecord(JSON.parse(rawUser));
    }

}

export function saveUser(user) {
    if(typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

export function removeSavedUser(user) {
    if(typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('user');
    }
}