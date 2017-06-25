import UserModel from 'types/user/UserModel';

export function getSavedUser() {
    if(typeof window !== 'undefined' && window.localStorage) {
        const rawUser = window.localStorage.getItem('user');
        if(!rawUser) return null;
        return new UserModel(JSON.parse(rawUser));
    }

    return null;
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