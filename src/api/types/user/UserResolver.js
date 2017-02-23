import login from 'api/auth/login';
import logout from 'api/auth/logout';
import UserRecord from 'api/types/user/UserRecord';


export default {
    node: null,
    list: [null],

    login: (args, context) => {
        return login(args.email, args.password, context.request)
            .then((userData) => {
                return new UserRecord(userData);
            });
    },

    logout: (args, context) => {
        return logout(context.request)
            .then((result) => {
                return result;
            });
    }
}