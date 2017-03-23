import 'whatwg-fetch';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import store from 'client-admin/store';
import App from 'client-admin/components/App';
import 'client-admin/sass/style';

ReactDom.render(<Provider store={store}>
    <App/>
</Provider>, document.getElementById('app'));
