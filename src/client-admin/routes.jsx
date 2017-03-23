import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import App from 'client-admin/components/App';
import Home from 'client-admin/components/Home';
import Dashboard from 'client-admin/components/admin/Dashboard';
import LoginPage from 'client-admin/components/admin/LoginPage';
import LogoutPage from 'client-admin/components/admin/LogoutPage';
import Admin from 'client-admin/components/admin/Admin';
import store from 'client-admin/store';


function checkAuth(nextState, replace) {
    // Don't redirect on server
    if(typeof window !== 'object') return;
    const state = store.getState();

    if(!state.auth.loggedIn) {
        replace({
            pathname: '/login'
        });
    }
}

export default <Route component={App}>
    <Route path='/' component={Home}/>

    <Route path='/login' component={LoginPage}/>
    <Route path='/logout' component={LogoutPage}/>

    <Route path='/admin' onEnter={checkAuth} component={Admin}>
        <IndexRedirect to='dashboard'/>
        <Route path='dashboard' component={Dashboard}/>
    </Route>
</Route>;