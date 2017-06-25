import login from 'server/auth/login';
import logout from 'server/auth/logout';
import UserModel from 'types/user/UserModel';


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