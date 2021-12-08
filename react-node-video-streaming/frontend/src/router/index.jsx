import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import appRoutes from './appRoutes';

import PrivateRoute from './PrivateRoute';

function AppRouter() {
  const publicRoutes = appRoutes.filter((route) => !route.isPrivate);
  const privateRoutes = appRoutes.filter((route) => route.isPrivate);
  return (
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
  );
}

export default AppRouter;
