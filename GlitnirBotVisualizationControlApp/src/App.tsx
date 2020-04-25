import React, { Fragment, useEffect } from "react";

import "./App.scss";
import LayoutRoute from "./components/shared/LayoutRoute";

import { Switch, Redirect, Route } from "react-router-dom";
import MainLayout from "./components/layouts/main";

import EntryPage from "./components/Main/EntryPage";
import BackTesting from "./components/Main/BackTesting";
import Dashboard from "./components/Main/Dashboard";
import {
  tradingViewRoute,
  entryPageRoute,
  backTestingRoute,
  dashboardRoute,
  controlViewRoute
} from "./routes";
import TradingView from "./components/Main/TradingView";
import ControlView from './components/Main/ControlView'


import EventEmitter from "events"; // i didn't use that (using redux)

import { useStores } from './stores';
import { initApp } from "./init";

// import { withRouter } from "react-router";

// import { HotKeys } from "react-hotkeys";

// import { VerticleButton as ScrollUpButton } from "react-scroll-up-button";

// const SwitchRouter = styled(Switch)`
//   box-sizing: border-box;
//   padding: 0;
//   margin: 0;
// `;

const App: React.FunctionComponent = () => {
  const stores = useStores();

  useEffect(() => {
    initApp();
  }, []);

  return (
    <Switch>
      <Redirect exact from="/" to={entryPageRoute} />
      <LayoutRoute
        exact
        layout={MainLayout}
        path={entryPageRoute}
        component={EntryPage}
      />
      <LayoutRoute
        exact
        layout={MainLayout}
        path={tradingViewRoute}
        component={TradingView}
      />
      <LayoutRoute
        exact
        layout={MainLayout}
        path={backTestingRoute}
        component={BackTesting}
      />
      <LayoutRoute
        exact
        layout={MainLayout}
        path={dashboardRoute}
        component={Dashboard}
      />
      <LayoutRoute
        exact
        layout={MainLayout}
        path={controlViewRoute}
        component={ControlView}
      />
    </Switch>
  );
};

export default App;
