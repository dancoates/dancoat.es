import BaseRecord from 'shared/baseRecord';

export default class AuthRecord extends BaseRecord({
    token: null,
    loggedIn: null,
    loginRequest: null,
    loginError: null,
    loggedOut: null,
    logoutRequest: null,
    logoutError: null
}) {}