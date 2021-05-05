import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { loadAnimate, cancelAnimate } from 'src/imgs/animateBg/load';
import MoonImg from 'src/imgs/animateBg/moon.png';
import { message } from 'antd';
import Utils from 'src/utils';
import Actions from 'src/actions';
import { useStore } from 'src/Provider';
import ActiveKey from './ActiveKey';
import UserLogin from './UserLogin';
import './Auth.scss';
async function login({ activeKey, phone, pwd, sms, store, history }) {
  const isMatched = Utils.matched(activeKey, phone);
  if (!isMatched) {
    message.warning('激活码不正确');
    return;
  }
  try {
    await Actions.AV.Cloud.verifySmsCode(sms, phone);
    const user = await Actions.AV.User.logIn(`+86${phone}`, pwd);
    localStorage.setItem('activeKey', activeKey);
    store.signin(user.toJSON());
    store.seActiveKey(activeKey);
    history.replace('/');
  } catch (e) {
    message.warning(e.rawMessage || '验证码错误');
  }
}
export default function Setting() {
  const history = useHistory();
  let store = useStore();
  const [activeKey, setActiveKey] = useState('');
  useEffect(() => {
    loadAnimate();
    return function () {
      cancelAnimate();
    };
  }, []);
  return (
    <div className="auth-page">
      <div className="sky-container">
        <img src={MoonImg} alt="moon" />
      </div>
      {!activeKey ? (
        <ActiveKey setActiveKey={setActiveKey} />
      ) : (
        <UserLogin
          setActiveKey={setActiveKey}
          login={(data) => {
            login({ ...data, activeKey, store, history });
          }}
        />
      )}
    </div>
  );
}
