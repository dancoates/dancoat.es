import React from 'react';
import {connect} from 'react-redux';
import * as authActions from 'client/actions/auth';

class LogoutPage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(authActions.logout());
    }
    render() {
        if(!this.props.auth.loggedIn) {
            this.props.router.replace('/admin/login');
            return null;
        }

        return <div>
            Logging out...
        </div>;
    }
}


export default connect((state) => {
    return {
        auth: state.auth
    }
})(LogoutPage);