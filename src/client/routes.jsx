import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import App from 'client/components/App';
import Home from 'client/components/Home';
import Dashboard from 'client/components/admin/Dashboard';
import LoginPage from 'client/components/admin/LoginPage';
import LogoutPage from 'client/components/admin/LogoutPage';

export default <Route component={App}>
    <Route path='/' component={Home}/>

    <Route path='/admin'>
        <IndexRedirect to='dashboard'/>
        <Route path='login' component={LoginPage}/>
        <Route path='logout' component={LogoutPage}/>
        <Route path='dashboard' component={Dashboard}/>
    </Route>
</Route>;