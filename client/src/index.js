import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import "./styles/css/index.css";
import App from "./App";
import store from "./store/store";
import registerServiceWorker from "./registerServiceWorker";

const root = document.getElementById("root");

render(
  <Provider store={store}>
    <BrowserRouter>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </Provider>,
  root
);

registerServiceWorker();
