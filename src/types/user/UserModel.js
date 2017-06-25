import BaseModel from 'types/BaseModel';

export default class UserRecord extends BaseModel({
    id: null,
    token: null,
    role: null,
    name: null,
    email: null,
    created: null,
    modified: null
}) {}