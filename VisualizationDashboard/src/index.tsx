import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Router } from "react-router";
import { createHashHistory /*createBrowserHistory*/ } from "history";
import eventEmitterService from './services/eventEmitterService';
import { startStreamConnectorService } from './services/streamsConnector/service';

export { eventEmitterService };

export interface GlobalState {
	deepstreamServerActive: boolean,
	deepstreamClientConnected: boolean
}

export const globalState: GlobalState = {
	deepstreamServerActive: false,
	deepstreamClientConnected: false
};

export const history = createHashHistory();

startStreamConnectorService();

ReactDOM.render(
	<Router history={history}>
		<App />
	</Router>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
