import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ROUTE from '../constants/route';

function PrivateRoute({ component: Component, ...rest }) {
  const user = useSelector((state) => state.auth.user);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to={ROUTE.HOME} />
      }
    />
  );
}

export default PrivateRoute;
