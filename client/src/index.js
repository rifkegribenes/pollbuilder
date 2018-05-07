import React from "react";
import { hydrate, render } from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/css/index.css";
import App from "./App";
import store from "./store/store";
import { unregister } from './registerServiceWorker';

const root = document.getElementById("root");

if (root.hasChildNodes()) {
  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    root
  );
} else {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    root
  );
}

// registerServiceWorker();
unregister();
