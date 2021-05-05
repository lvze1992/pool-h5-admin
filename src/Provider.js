import React, { useContext, createContext, useState } from 'react';
import Actions from 'src/actions';
import Utils from 'src/utils';
const StoreContext = createContext();
function useProvideStore() {
  const currentUser = Actions.AV.User.current();
  const [activeKey, seActiveKey] = useState(localStorage.getItem('activeKey') || '');
  const [user, setUser] = useState(currentUser ? currentUser.toJSON() : null);
  console.log('user', user, Actions.AV, activeKey);
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
    signin,
    signout,
    seActiveKey,
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
