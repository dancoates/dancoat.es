import BaseRecord from 'shared/baseRecord';

export default class UserRecord extends BaseRecord({
    id: null,
    token: null,
    role: null,
    name: null,
    email: null,
    created: null,
    modified: null
}) {}