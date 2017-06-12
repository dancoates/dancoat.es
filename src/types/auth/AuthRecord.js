import BaseRecord from 'types/baseRecord';

export default class AuthRecord extends BaseRecord({
    token: null,
    status: null,
    error: null
}) {}