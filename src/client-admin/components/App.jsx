import React from 'react';
import {Route, Redirect, BrowserRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Home from 'client-admin/components/Home';
import LoginPage from 'client-admin/components/LoginPage';
import LogoutPage from 'client-admin/components/LogoutPage';

class App extends React.Component {
    render() {
        console.log(this.props);
        return <BrowserRouter>
            <div>
                <Route path='/admin' exact render={() => <Redirect to={'/admin/dashboard'}/>}/>
                <Route path='/admin/login' component={LoginPage}/>
                <Route path='/admin/logout' component={LogoutPage}/>

                {this.props.loggedIn
                    ? <Route path='/admin/dashboard' component={Home}/>
                    : <Redirect to={'/admin/login'}/>
                }
            </div>
        </BrowserRouter>;
    }
}

export default connect(state => {
    return {loggedIn: state.auth.loggedIn};
})(App);