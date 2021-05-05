//https://reactrouter.com/web/example/sidebar
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Tab, Auth, Dashboard } from './pages';
import { ProvideStore, useStore } from './Provider';
import './App.scss';

function PrivateRoute({ authType, component, ...rest }) {
  let store = useStore();
  const location = useLocation();
  return (
    <Route
      {...rest}
      component={
        store.user && store.activeKey
          ? component
          : () => (
              <Redirect
                to={{
                  pathname: '/auth',
                  state: { from: location, authType },
                }}
              />
            )
      }
    />
  );
}

function App() {
  return (
    <ProvideStore>
      <Router>
        <Switch>
          <Redirect exact from="/" to="/dashboard" />
          <Route path="/auth" component={Auth} />
          <Switch>
            <Tab>
              <PrivateRoute path="/dashboard" component={Dashboard} />
            </Tab>
          </Switch>
        </Switch>
      </Router>
    </ProvideStore>
  );
}

export default App;
