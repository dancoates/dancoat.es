import 'whatwg-fetch';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import store from 'client-public/store';
import App from 'client-public/components/App';
import 'client-public/sass/style';

ReactDom.render(<Provider store={store}>
    <BrowserRouter>
        <App/>
    </BrowserRouter>
</Provider>, document.getElementById('app'));
