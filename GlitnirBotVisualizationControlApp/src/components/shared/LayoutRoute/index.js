import React, { Component } from "react";

import { Route } from "react-router-dom";

export default class LayoutRoute extends Component {
  render() {
    const { component: Component, layout: Layout, ...rest } = this.props;
    
    return (
      <Route
        {...rest}
        render={matchProps => (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        )}
      />
    );
  }
}
