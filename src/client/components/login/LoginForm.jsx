import React from 'react';
import {connect} from 'react-redux';
import * as authActions from 'client/actions/auth';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleSubmit(ee) {
        ee.preventDefault();
        const username = ee.target[0].value;
        const password = ee.target[1].value;
        this.props.dispatch(authActions.login({username, password}));
    }
    render() {
        return <form onSubmit={this.handleSubmit}>
            <div>
                <label htmlFor='Login_username'>Username</label>
                <input id='Login_username'/>
            </div>
            <div>
                <label htmlFor='Login_password'>Password</label>
                <input id='Login_password' type='password'/>
            </div>
            <div>
                <button type='submit'>Submit</button>
            </div>
        </form>;
    }
}


export default connect((state) => {
    return {
        auth: state.auth
    }
})(LoginForm);