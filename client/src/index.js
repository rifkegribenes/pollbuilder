import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import './styles/css/index.css';
import App from './App';
import store from './store/store';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');

render(
	<Provider store={store}>
		<App />
	</Provider>,
	root,
);

registerServiceWorker();
