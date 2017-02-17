import React from 'react';
import {Route} from 'react-router';
import App from 'client/components/App';
import Home from 'client/components/Home';
import Test from 'client/components/Test';

export default <Route component={App}>
    <Route path='/' component={Home}/>
    <Route path='/test/:param' component={Test}/>
</Route>;