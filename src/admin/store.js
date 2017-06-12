import thunk from 'redux-thunk';
import reducer from 'admin/reducer';
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


// create store creator
export default (initialState = {}, onAction) => createStore(
    reducer(onAction),
    initialState,
    composeEnhancers(middleware)
);
