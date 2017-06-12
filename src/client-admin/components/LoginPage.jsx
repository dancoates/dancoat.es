import React from 'react';
import {connect} from 'react-redux';
import * as authActions from 'client-admin/actions/auth';
import {Redirect} from 'react-router-dom';
import {LOGGED_IN} from 'client-admin/constants/authStates';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleSubmit(ee) {
        ee.preventDefault();
        const email = ee.target[0].value;
        const password = ee.target[1].value;
        this.props.dispatch(authActions.login({email, password}));
    }

    render() {
        if(this.props.auth.status === LOGGED_IN) {
            return <Redirect to={'/admin'}/>;
        }

        return <form onSubmit={this.handleSubmit}>
            <div>
                <label htmlFor='Login_email'>Email</label>
                <input id='Login_email'/>
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