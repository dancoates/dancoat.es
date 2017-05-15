import 'whatwg-fetch';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import store from 'admin/store';
import App from 'client-admin/components/App';
import 'client-admin/sass/style';
import {connectSocket} from 'client-admin/util/ws';
import immutablizeState from 'admin/immutablizeState';

connectSocket()
    .then(initialState => {
        ReactDom.render(<Provider store={store(immutablizeState(initialState))}>
            <App/>
        </Provider>, document.getElementById('app'));
    });




ReactDom.render(<div>Loading...</div>, document.getElementById('app'));