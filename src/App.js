//https://reactrouter.com/web/example/sidebar
import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { Tab, Auth, Dashboard, PowerHistory, UserHistory, Profit, Withdraw, UserHistoryDetail } from './pages';
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
          <Redirect exact from="/" to="/chia/powerHistory" />
          <Route path="/auth" component={Auth} />
          <Switch>
            <Tab>
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route path="/chia">
                <Switch>
                  <Redirect exact from="/chia" to="/chia/powerHistory" />
                  <PrivateRoute path="/chia/powerHistory" component={PowerHistory} />
                  <PrivateRoute path="/chia/userHistory/:objectId" component={UserHistoryDetail} />
                  <PrivateRoute path="/chia/userHistory" component={UserHistory} />
                  <PrivateRoute path="/chia/profit" component={Profit} />
                  <PrivateRoute path="/chia/withdraw" component={Withdraw} />
                </Switch>
              </Route>
            </Tab>
          </Switch>
        </Switch>
      </Router>
    </ProvideStore>
  );
}

export default App;
