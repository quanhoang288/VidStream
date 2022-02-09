import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import appRoutes from './appRoutes';

import PrivateRoute from './PrivateRoute';
import WebSocketProvider from '../utils/websocket.context';

function AppRouter() {
  const publicRoutes = appRoutes.filter((route) => !route.isPrivate);
  const privateRoutes = appRoutes.filter((route) => route.isPrivate);
  return (
    <WebSocketProvider>
      <Router>
        <Switch>
          {publicRoutes.map((publicRoute) => (
            <Route
              exact
              path={publicRoute.path}
              component={publicRoute.component}
              key={publicRoute.path}
            />
          ))}

          {privateRoutes.map((privateRoute) => (
            <PrivateRoute
              path={privateRoute.path}
              component={privateRoute.component}
              exact
              key={privateRoute.path}
            />
          ))}
        </Switch>
      </Router>
    </WebSocketProvider>
  );
}

export default AppRouter;
