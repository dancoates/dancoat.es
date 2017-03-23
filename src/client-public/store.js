import thunk from 'redux-thunk';
import reducer from 'client-public/reducer';
import {compose, createStore, applyMiddleware} from 'redux';

// create middleware
var middleware = applyMiddleware(
    thunk
);
// hook up redux devtool
const composeEnhancers = (
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
) || compose;

const store = createStore(reducer, {}, composeEnhancers(middleware));

// create and export the store
export default store;