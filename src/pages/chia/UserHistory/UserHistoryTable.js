import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { message, Table, Tooltip, Button } from 'antd';
import { useStore } from 'src/Provider';
import actions from 'src/actions';
import _ from 'lodash';
const getColumns = (chia) => [
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    render: (v, i) => {
      return _.get(i, 'user.mobilePhoneNumber', '-');
    },
  },
  {
    title: '购买算力/T',
    dataIndex: 'buyPower',
    key: 'buyPower',
  },
  {
    title: '购买总值(花费)/USDT',
    dataIndex: 'buyPowerCost',
    key: 'buyPowerCost',
  },
  {
    title: '购买时间',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '生效时间',
    dataIndex: 'startDate',
    key: 'startDate',
  },
  {
    title: '到期时间',
    dataIndex: 'endDate',
    key: 'endDate',
  },
  {
    title: '累计收益/XCH',
    dataIndex: 'totalProfit',
    key: 'totalProfit',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (v, i) => {
      return (
        <Link to={`/chia/userHistory/${i.objectId}`}>
          <Button size="small">详情</Button>
        </Link>
      );
    },
  },
];
async function fetchData() {
  try {
    const data = await actions.getUserBuy();
    return data;
  } catch (e) {
    message.warning(e.rawMessage || '异常：PHT20');
    return [];
  }
}
export default function UserHistoryTable(props) {
  const { showDraw, reloadPage } = props;
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const { chia } = useStore();
  useEffect(() => {
    (async function () {
      setLoading(true);
      const data = await fetchData();
      setDataSource(data);
      setLoading(false);
    })();
  }, [showDraw, reloadPage]);
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
