import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { message, Table, Tooltip, Button } from 'antd';
import { useStore } from 'src/Provider';
import actions from 'src/actions';
import _ from 'lodash';
const commonRender = (v, i) => {
  return (
    <Tooltip title={v}>
      <span className="overflow-text">{v}</span>
    </Tooltip>
  );
};
const getColumns = (chia) => [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '有效算力/T',
    dataIndex: 'availablePower',
    key: 'availablePower',
    render: commonRender,
  },
  {
    title: '待P盘算力/T',
    dataIndex: 'waitpPower',
    key: 'waitpPower',
    render: commonRender,
  },
  {
    title: '当日挖矿净收益/XCH',
    dataIndex: 'todayProfit',
    key: 'todayProfit',
    render: commonRender,
  },
  {
    title: '累计挖矿净收益/XCH',
    dataIndex: 'totalProfit',
    key: 'totalProfit',
    render: commonRender,
  },
  {
    title: '单T收益/XCH',
    dataIndex: 'perTProfit',
    key: 'perTProfit',
    render: commonRender,
  },
];
async function fetchData(objectId) {
  try {
    const data = await actions.getUserBuyChiaProfit(objectId);
    return data;
  } catch (e) {
    message.warning(e.rawMessage || '异常：UHD47');
    return [];
  }
}
export default function UserHistoryTable(props) {
  const { showDraw, reloadPage, objectId } = props;
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const { chia } = useStore();
  useEffect(() => {
    (async function () {
      setLoading(true);
      const data = await fetchData(objectId);
      setDataSource(data);
      setLoading(false);
    })();
  }, [showDraw, reloadPage, objectId]);
  return (
    <div className="table-container">
      <Table
        columns={getColumns(chia)}
        dataSource={dataSource}
        loading={loading}
        rowKey="objectId"
        size="small"
        scroll={{
          x: 'max-content',
        }}
      />
    </div>
  );
}
