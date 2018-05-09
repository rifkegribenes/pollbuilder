import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles/css/index.css";
import App from "./App";
import store from "./store/store";
import { unregister } from './registerServiceWorker';

const root = document.getElementById("root");

render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  root
);

// registerServiceWorker();
unregister();
