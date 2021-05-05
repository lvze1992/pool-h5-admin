import React, { useEffect, useState } from 'react';
import { message, Input, Space, Button } from 'antd';
export default function ActiveKey(props) {
  const [activeKey, setActiveKey] = useState('');
  useEffect(() => {
    window.bgCancelAnimate && window.bgCancelAnimate();
  }, []);
  return (
    <div className="key-page">
      <Space
        direction="vertical"
        size="large"
        style={{
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <h1>加零云矿</h1>
        <Input
          placeholder="请输入激活码"
          prefix={<i className="iconfont iconshebeijihuo" />}
          onChange={(e) => {
            setActiveKey(e.target.value);
          }}
        />
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={() => {
            if (!activeKey) {
              message.warning('请输入有效激活码');
              return;
            }
            window.bgAnimate && window.bgAnimate();
            props.setActiveKey(activeKey);
          }}
        >
          下一步
        </Button>
      </Space>
    </div>
  );
}
