import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Tag, Tooltip } from 'antd';
import { useStore } from 'src/Provider';
export default function CustomPageHeader(props) {
  const { title, extra } = props;
  const { chia } = useStore();
  const { closingDate } = chia.chiaConfig;
  return (
    <PageHeader
      title={title}
      subTitle={
        <div
          className="header-tip"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>上一结算日期</span>
          <Tooltip placement="bottom" title="请勿擅自修改结算日期前的数据，这会导致无法预知的情况">
            <i className="iconfont icontishi" style={{ color: 'red' }} />
          </Tooltip>
        </div>
      }
      tags={<Tag color="blue">{closingDate}</Tag>}
      className="site-page-header"
      extra={extra}
    />
  );
}
