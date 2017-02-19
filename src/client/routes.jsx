import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import App from 'client/components/App';
import Home from 'client/components/Home';
import Dashboard from 'client/components/admin/Dashboard';
import LoginForm from 'client/components/login/LoginForm';

export default <Route component={App}>
    <Route path='/' component={Home}/>


    <Route path='/admin'>
        <IndexRedirect to='dashboard'/>
        <Route path='login' component={LoginForm}/>
        <Route path='dashboard' component={Dashboard}/>
    </Route>
</Route>;