import 'whatwg-fetch';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import store from 'client/store';
import routes from 'client/routes';
import 'client/sass/style';

ReactDom.render(<Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
</Provider>, document.getElementById('app'));
