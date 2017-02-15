import Inferno from 'inferno';
import {Route, IndexRoute} from 'inferno-router';
import App from 'client/components/App';
import Home from 'client/components/Home';
import Test from 'client/components/Test';


export default <Route component={App}>
    <IndexRoute component={Home}/>
    <Route path='/test/:param' component={Test}/>
</Route>;