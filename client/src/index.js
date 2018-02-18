import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PersonDetail from './PersonDetail';

import "./style.css";
// import 'bootstrap/dist/css/bootstrap.css';


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/person/:id?" component={PersonDetail} />
                    <Route path="/" component={Home} />
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>, document.getElementById('root'));