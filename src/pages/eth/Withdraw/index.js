import React, { useState } from 'react';
import { PageHeader } from 'src/components';
import WithdrawHistoryTable from './WithdrawHistoryTable';
import './style.scss';
export default function Withdraw() {
  const [reloadPage, setReload] = useState(0);
  return (
    <div className="withdraw-page">
      <PageHeader
        title="提现监控"
        extra={[
          <div
            className="ghost-button"
            onClick={() => {
              setReload(Date.now());
            }}
          >
            <i className="iconfont iconshuaxin" />
          </div>,
        ]}
      />
      <WithdrawHistoryTable reloadPage={reloadPage} setReload={setReload} />
    </div>
  );
}
