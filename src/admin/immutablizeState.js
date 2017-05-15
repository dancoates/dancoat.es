import {fromJS} from 'immutable';


import UploadRecord from 'types/upload/UploadRecord';
import UserRecord from 'types/user/UserRecord';
import AuthRecord from 'types/auth/AuthRecord';



const entity = (Record) => {
    return {
        type: 'entity',
        record: Record
    };
}

const listOf = (Record) => {
    return {
        type: 'list',
        record: Record
    };
}

const ENTITY = 'ENTITY';
const LIST = 'LIST';

const schema = fromJS({
    upload: {
        type: ENTITY,
        record: UploadRecord
    },
    user: {
        type: ENTITY,
        record: UserRecord
    },
    auth: {
        type: ENTITY,
        record: AuthRecord
    }
});


export default function immutablizeState(state) {
    return schema.map((item, key) => {
        if(item.get('type') === ENTITY) {
            const ItemRecord = item.get('record');
            return new ItemRecord(state[key]);
        }
    }).toObject();
} 