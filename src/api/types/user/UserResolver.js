import {query} from 'database/connect';
import SQL from 'sql-template-strings';
import login from 'api/auth/login';
import UserRecord from 'api/types/user/UserRecord';


export default {
    node: null,
    list: [null],

    login: (args, context) => {
        return login(args.email, args.password, context.request)
            .then((userData) => {
                return new UserRecord(userData);
            });
    }
}