import BaseModel from 'types/BaseModel';

export default class AuthRecord extends BaseModel({
    token: null,
    status: null,
    error: null
}) {}