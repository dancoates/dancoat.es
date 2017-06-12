import 'whatwg-fetch';
import React from 'react';
import ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import store from 'admin/store';
import App from 'client-admin/components/App';
import 'client-admin/sass/style';
import hydrate from 'client-admin/util/hydrate';
import immutablizeState from 'admin/immutablizeState';
import {sendMessage, onMessage} from 'client-admin/util/ws';
import {LOGGED_OUT} from 'client-admin/constants/authStates';

function onAction(action) {
    if(action.secondary || action.type === '@@INIT') return;
    sendMessage({
        type: 'action',
        payload: {
            ...action,
            secondary: true
        }
    });
}

const renderApp = (initialState) => {
    const storeInstance = store(immutablizeState(initialState), onAction);

    onMessage((data) => {
        if(data.type === 'action') {
            storeInstance.dispatch(data.payload);
        }
    });

    ReactDom.render(<Provider store={storeInstance}>
        <App/>
    </Provider>, document.getElementById('app'));
};

hydrate()
    .then(renderApp)
    .catch((err) => {
        renderApp({
            auth: {
                status: LOGGED_OUT
            }
        });
    });



// Loading while hydrating
ReactDom.render(<div>Loading...</div>, document.getElementById('app'));