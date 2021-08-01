//https://reactrouter.com/web/example/sidebar
import React, { useEffect } from 'react';
import { HashRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { message } from 'antd';
import {
  Tab,
  Auth,
  Dashboard,
  CHIA_PowerHistory,
  CHIA_UserHistory,
  CHIA_Profit,
  CHIA_Withdraw,
  CHIA_UserHistoryDetail,
  CHIA_Settle,
  ETH_PowerHistory,
  ETH_UserHistory,
  ETH_Profit,
  ETH_Withdraw,
  ETH_UserHistoryDetail,
  ETH_Settle,
  ETH_Market,
} from './pages';
import { ProvideStore, useStore } from './Provider';
import './App.scss';

function PrivateRoute({ authType, component, ...rest }) {
  let store = useStore();
  const location = useLocation();
  useEffect(() => {
    if (store.user && store.user.role !== 'admin') {
      message.warning('您不是管理员');
    }
  }, []);
  return (
    <Route
      {...rest}
      component={
        store.user && store.user.role === 'admin' && store.activeKey
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
          <Redirect exact from="/" to="/eth/powerHistory" />
          <Route path="/auth" component={Auth} />
          <Switch>
            <Tab>
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route path="/chia">
                <Switch>
                  <Redirect exact from="/chia" to="/chia/powerHistory" />
                  <PrivateRoute path="/chia/powerHistory" component={CHIA_PowerHistory} />
                  <PrivateRoute path="/chia/userHistory/:objectId" component={CHIA_UserHistoryDetail} />
                  <PrivateRoute path="/chia/userHistory" component={CHIA_UserHistory} />
                  <PrivateRoute path="/chia/profit" component={CHIA_Profit} />
                  <PrivateRoute path="/chia/withdraw" component={CHIA_Withdraw} />
                  <PrivateRoute path="/chia/settle" component={CHIA_Settle} />
                </Switch>
              </Route>
              <Route path="/eth">
                <Switch>
                  <Redirect exact from="/eth" to="/eth/powerHistory" />
                  <PrivateRoute path="/eth/powerHistory" component={ETH_PowerHistory} />
                  <PrivateRoute path="/eth/userHistory/:objectId" component={ETH_UserHistoryDetail} />
                  <PrivateRoute path="/eth/userHistory" component={ETH_UserHistory} />
                  <PrivateRoute path="/eth/profit" component={ETH_Profit} />
                  <PrivateRoute path="/eth/withdraw" component={ETH_Withdraw} />
                  <PrivateRoute path="/eth/settle" component={ETH_Settle} />
                  <PrivateRoute path="/eth/market" component={ETH_Market} />
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
