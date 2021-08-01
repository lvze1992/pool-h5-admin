import React, { useState } from 'react';
import { Button, Tag, Drawer } from 'antd';
import { useHistory } from 'react-router-dom';
import { PageHeader } from 'src/components';
import UserHistoryForm from './UserHistoryForm';
import UserHistoryTable from './UserHistoryTable';
import './style.scss';
export default function UserHistory() {
  const history = useHistory();
  const [showDraw, setShowDraw] = useState(false);
  const [reloadPage, setReload] = useState(0);
  return (
    <div className="userHistory-page">
      <PageHeader
        title="用户购买"
        extra={[
          <div
            className="ghost-button"
            onClick={() => {
              setReload(Date.now());
            }}
          >
            <i className="iconfont iconshuaxin" />
          </div>,
          <Button
            key="1"
            type="primary"
            onClick={() => {
              setShowDraw(true);
            }}
          >
            添加购买
          </Button>,
        ]}
      />
      <UserHistoryTable showDraw={showDraw} reloadPage={reloadPage} setShowDraw={setShowDraw} />
      <Drawer
        width={'600px'}
        title="算力购买添加"
        placement="right"
        closable={false}
        onClose={() => {
          setShowDraw(false);
        }}
        visible={showDraw}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <UserHistoryForm setShowDraw={setShowDraw} />
      </Drawer>
    </div>
  );
}
