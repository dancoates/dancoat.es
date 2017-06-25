//@flow
import {fromJS} from 'immutable';


import UploadModel from 'types/upload/UploadModel';
import UserModel from 'types/user/UserModel';
import AuthModel from 'types/auth/AuthModel';



const entity = (Model) => {
    return {
        type: 'entity',
        model: Model
    };
}

const listOf = (Model) => {
    return {
        type: 'list',
        model: Model
    };
}

const ENTITY = 'ENTITY';
const LIST = 'LIST';

const schema = fromJS({
    upload: {
        type: ENTITY,
        model: UploadModel
    },
    user: {
        type: ENTITY,
        model: UserModel
    },
    auth: {
        type: ENTITY,
        model: AuthModel
    }
});


export default function immutablizeState(state) {
    return schema.map((item, key) => {
        if(item.get('type') === ENTITY) {
            const ItemModel = item.get('model');
            return new ItemModel(state[key]);
        }
    }).toObject();
} 