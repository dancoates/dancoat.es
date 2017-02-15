import 'whatwg-fetch';
import Inferno from 'inferno';
import {Provider} from 'inferno-redux';
import {Router} from 'inferno-router';
import {createBrowserHistory} from 'history';
import store from 'client/store';
import routes from 'client/routes';

const browserHistory = createBrowserHistory();

Inferno.render(<Provider store={store}>
    <Router history={browserHistory} children={routes}/>
</Provider>, document.getElementById('app'));
