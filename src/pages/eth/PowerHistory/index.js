import React, { useState } from 'react';
import { Button, Tag, Drawer } from 'antd';
import { useHistory } from 'react-router-dom';
import { PageHeader } from 'src/components';
import PowerHistoryForm from './PowerHistoryForm';
import PowerHistoryTable from './PowerHistoryTable';
import './style.scss';
export default function PowerHistory() {
  const history = useHistory();
  const [showDraw, setShowDraw] = useState(false);
  const [reloadPage, setReload] = useState(0);
  return (
    <div className="powerHistory-page">
      <PageHeader
        title="算力每日记录"
        extra={[
          <div
            key="2"
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
            添加算力
          </Button>,
        ]}
      />
      <PowerHistoryTable showDraw={showDraw} reloadPage={reloadPage} setShowDraw={setShowDraw} />
      <Drawer
        width={'600px'}
        title="每日算力录入"
        placement="right"
        closable={false}
        onClose={() => {
          setShowDraw(false);
        }}
        visible={showDraw}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <PowerHistoryForm setShowDraw={setShowDraw} />
      </Drawer>
    </div>
  );
}
