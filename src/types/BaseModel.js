import {Record, fromJS} from 'immutable';

export default (defaultProps) => class extends Record(defaultProps) {
    constructor(props){
        super(fromJS(props));
        return this;
    }
};