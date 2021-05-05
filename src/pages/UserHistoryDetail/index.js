import React, { useState } from 'react';
import { Button, Tag, Drawer } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { PageHeader } from 'src/components';
import UserHistoryTable from './UserHistoryTable';
import './style.scss';
export default function UserHistory() {
  const history = useHistory();
  const { objectId } = useParams();
  const [showDraw, setShowDraw] = useState(false);
  const [reloadPage, setReload] = useState(0);
  console.log('objectId', objectId);

  return (
    <div className="userHistory-page">
      <PageHeader
        title="用户发放详情"
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
            onClick={() => {
              history.goBack();
            }}
          >
            返回
          </Button>,
        ]}
      />
      <UserHistoryTable showDraw={showDraw} reloadPage={reloadPage} setShowDraw={setShowDraw} objectId={objectId} />
    </div>
  );
}
