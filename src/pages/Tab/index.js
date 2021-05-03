import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import './tab.scss';
export default function Tab(props) {
  const location = useLocation();
  const history = useHistory();
  return (
    <div className="tab-menu">
      <Button>2323</Button>
      {props.children}
    </div>
  );
}
