import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Tag, Tooltip } from 'antd';
import { useRouteMatch } from 'react-router-dom';
import _ from 'lodash';
import { useStore } from 'src/Provider';
function getPoolId(match) {
  try {
    const { path } = match;
    const execResult = /\/([a-z]*)\//.exec(path)[1];
    return execResult.toUpperCase();
  } catch (e) {
    return '';
  }
}
function getConfig(store, poolId) {
  return _.get(store, `${poolId.toLowerCase()}.${poolId.toLowerCase()}Config`);
}
export default function CustomPageHeader(props) {
  const match = useRouteMatch();
  const poolId = getPoolId(match);
  const { title, extra } = props;
  const store = useStore();
  const config = getConfig(store, poolId);
  const { closingDate = '-' } = config;
  const { price } = store;

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
      tags={[
        <Tag key="closingDate" color="blue">
          {closingDate}
        </Tag>,
        <Tag key="price" color="blue">
          {`USDT ≈ ${price['USDT']}`}
        </Tag>,
      ]}
      className="site-page-header"
      extra={extra}
    />
  );
}
