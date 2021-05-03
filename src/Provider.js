import React, { useContext, createContext, useState } from 'react';

const StoreContext = createContext();

function useProvideStore() {
  const [user, setUser] = useState('null');

  const signin = (user, cb) => {
    setUser(user);
    cb && cb();
  };

  const signout = (cb) => {
    setUser(null);
    cb && cb();
  };

  return {
    user,
    signin,
    signout,
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
