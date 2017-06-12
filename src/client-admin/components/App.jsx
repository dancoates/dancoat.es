import React from 'react';
import {Route, Redirect, BrowserRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Dashboard from 'client-admin/components/Dashboard';
import LoginPage from 'client-admin/components/LoginPage';
import LogoutPage from 'client-admin/components/LogoutPage';
import {LOGGED_IN} from 'client-admin/constants/authStates';


class App extends React.Component {
    render() {
        return <BrowserRouter>
            <div>
                <Route path='/admin' exact render={() => <Redirect to={'/admin/dashboard'}/>}/>
                <Route path='/admin/login' component={LoginPage}/>
                <Route path='/admin/logout' component={LogoutPage}/>

                {this.props.loggedIn
                    ? <Route path='/admin/dashboard' component={Dashboard}/>
                    : <Redirect to={'/admin/login'}/>
                }
            </div>
        </BrowserRouter>;
    }
}

export default connect(state => {
    return {loggedIn: state.auth.status === LOGGED_IN};
})(App);