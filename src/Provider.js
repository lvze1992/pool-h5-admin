import React, { useContext, createContext, useState, useEffect } from 'react';
import Actions from 'src/actions';
import Utils from 'src/utils';
const StoreContext = createContext();
function useProvideStore() {
  const currentUser = Actions.AV.User.current();
  const [activeKey, seActiveKey] = useState(localStorage.getItem('activeKey') || '');
  const [user, setUser] = useState(currentUser ? currentUser.toJSON() : null);
  const [chiaConfig, setChiaConfig] = useState({});
  const [ethConfig, setEthConfig] = useState({});
  const [tokens, setTokens] = useState([]);
  const [price, setPrice] = useState({});
  useEffect(() => {
    (async function () {
      const chiaConfig = await Actions.getChiaConfig();
      const ethConfig = await Actions.getETHConfig();
      const tokens = await Actions.getTokens();
      const price = await Actions.getPrice({});
      setChiaConfig(chiaConfig);
      setEthConfig(ethConfig);
      setTokens(tokens);
      setPrice(price);
    })();
  }, []);
  console.log('useProvideStore', user, Actions.AV, price, tokens, chiaConfig, ethConfig);
  const userPhone = user ? user.mobilePhoneNumber : '';
  const isMatched = Utils.matched(activeKey, userPhone.replace('+86', ''));
  const signin = (user, cb) => {
    setUser(user);
    cb && cb();
  };

  const signout = (cb) => {
    setUser(null);
    cb && cb();
  };
  if (!isMatched) {
    return {
      signin,
      signout,
      seActiveKey,
    };
  }

  return {
    user,
    activeKey,
    chia: {
      chiaConfig,
    },
    eth: {
      ethConfig,
    },
    price,
    tokens,
    signin,
    signout,
    seActiveKey,
    setChiaConfig,
  };
}
function ProvideStore({ children }) {
  const auth = useProvideStore();
  return <StoreContext.Provider value={auth}>{children}</StoreContext.Provider>;
}
function useStore() {
  return useContext(StoreContext);
}
export { ProvideStore, useStore };
