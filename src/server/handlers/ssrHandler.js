//@flow
import React from 'react';
import {StaticRouter} from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import {Provider} from 'react-redux';
import ClientPublicStore from 'client-public/store';
import ClientPublicIndex from 'client-public/index.static';
import ClientPublicApp from 'client-public/components/App';
import ClientAdminIndex from 'client-admin/index.static';


export function adminRenderHandler(request, reply) {
    const wrapper = <ClientAdminIndex content=''/>
    return reply(ReactDOMServer.renderToString(wrapper));
}

export function publicRenderHandler(request, reply) {
    const path = request.path;
    const context = {};

    const content = ReactDOMServer.renderToString(
        <Provider store={ClientPublicStore}>
            <StaticRouter
                location={path}
                context={context}
            >
                <ClientPublicApp/>
            </StaticRouter>
        </Provider>
    );

    const wrapper = <ClientPublicIndex content={content}/>;
    return reply(ReactDOMServer.renderToString(wrapper));
}