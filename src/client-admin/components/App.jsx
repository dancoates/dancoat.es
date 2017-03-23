import React from 'react';
import {Route} from 'react-router-dom';

import Home from 'client-admin/components/Home';


export default class App extends React.Component {
    render() {
        return <div>
            <Route path='/admin' exact component={Home}/>
        </div>;
    }
}
