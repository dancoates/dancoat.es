import {query} from 'database/connect';
import SQL from 'sql-template-strings';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const account = {
    id: 1,
    token: 'asdfadfsadfs',
    name: 'Dan Coates',
    email: 'mail@dancoat.es',
    created: '20161117',
    modified: '20161117'
};


export default {
    node: account,
    list: [account],
    login: (args) => {
        // @TODO chagne username to email
        return query(SQL`select id, email, password from account where email = ${args.username}`)
            .then((result) => {
                return new Promise((resolve, reject) => {
                    if(result && result.rows && result.rows.length === 1) {
                        const user = result.rows[0];
                        bcrypt.compare(args.password, user.password, function(err, res) {
                            if(err) return reject(err);

                            if(res) {
                                const token = jwt.sign(
                                    {
                                        username: args.username
                                    },
                                    process.env.JWT_SECRET_KEY,// @TODO check that this is set
                                    {
                                        expiresIn: '1h'
                                    }
                                );

                                return resolve({
                                    email: args.username,
                                    token: token
                                });
                            } else {
                                return reject(new Error('Incorrect username or password'));
                            }
                        });

                    } else {
                        return reject(new Error('Incorrect username or password'));
                    }
                });
            });
    }
}