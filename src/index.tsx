import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Reducer } from 'redux';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// import persistState from 'redux-localstorage';

import reducers, { State } from './reducers';

let store = createStore(
  reducers as Reducer<State>,
  compose(
    applyMiddleware(thunk),
    // persistState()
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
