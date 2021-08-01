import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import './tab.scss';
const { SubMenu, Item } = Menu;

export default function Tab(props) {
  const location = useLocation();
  const history = useHistory();
  const [current, setCurent] = useState(location.pathname);

  return (
    <div className="tab-menu">
      <Menu
        theme="dark"
        onClick={(e) => {
          setCurent(e.key);
          history.push(e.key);
        }}
        style={{ width: '200px', height: '100vh' }}
        defaultOpenKeys={['eth']}
        selectedKeys={[current]}
        mode="inline"
      >
        <SubMenu key="chia" icon={<i className="menu-icon iconfont iconmineral" />} title="Chia算力管理">
          <Item key="/chia/powerHistory">算力每日记录</Item>
          <Item key="/chia/userHistory">用户记录</Item>
          <Item key="/chia/profit">收益发放</Item>
          <Item key="/chia/withdraw">提现监控</Item>
          <Item key="/chia/settle">结算</Item>
        </SubMenu>
        <SubMenu key="eth" icon={<i className="menu-icon iconfont iconmineral" />} title="ETH算力管理">
          <Item key="/eth/powerHistory">算力每日记录</Item>
          <Item key="/eth/userHistory">用户记录</Item>
          <Item key="/eth/profit">收益发放</Item>
          <Item key="/eth/withdraw">提现监控</Item>
          <Item key="/eth/settle">结算</Item>
          <Item key="/eth/market">行情</Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<i className="menu-icon iconfont iconyonghu" />} title="用户管理">
          <Item key="11">Option 1</Item>
          <Item key="12">Option 2</Item>
          <Item key="13">Option 3</Item>
          <Item key="14">Option 4</Item>
        </SubMenu>
      </Menu>
      <div className="menu-container">{props.children}</div>
    </div>
  );
}
