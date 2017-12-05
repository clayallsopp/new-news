import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore, Reducer } from "redux";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import "./index.css";

import { Provider } from "react-redux";

import reducers, { IState } from "./reducers";

// tslint:disable-next-line no-any
const devtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

const store = createStore(reducers as Reducer<IState>, devtools && devtools());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
