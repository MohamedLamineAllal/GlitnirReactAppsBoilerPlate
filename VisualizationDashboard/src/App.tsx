import React, { Fragment, useEffect } from "react";

import "./App.scss";
import LayoutRoute from "./components/shared/LayoutRoute";

import { Switch, Redirect, Route } from "react-router-dom";
import MainLayout from "./components/layouts/main";

import EntryPage from "./components/Main/EntryPage";
import Dashboard from './components/Main/Dashboard';

import { entryPageRoute, dashboardRoute } from "./routes";

const App: React.FunctionComponent = () => {
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
                layout={MainLayout}
                path={dashboardRoute}
                component={Dashboard}
            />
        </Switch>
    );
};

export default App;
