import React from 'react';
import {connect} from 'react-redux';
import * as authActions from 'client-public/actions/auth';

class LogoutPage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if(!this.props.auth.loggedOut) {
            this.props.dispatch(authActions.logout());
        }
    }
    render() {
        const {logoutRequest, logoutError, loggedOut} = this.props.auth;
        console.log(logoutRequest, logoutError, loggedOut);

        return <div>
            {
                logoutRequest
                    ? 'Logging out...'
                    : logoutError
                        ? 'There was an error logging out: ' + logoutError.message
                        : loggedOut
                            ? 'Logged Out'
                            : 'No Logout info'
            }
        </div>;
    }
}


export default connect((state) => {
    return {
        auth: state.auth
    }
})(LogoutPage);