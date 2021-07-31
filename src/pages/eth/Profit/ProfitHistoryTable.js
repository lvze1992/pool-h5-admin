import React, { useState, useEffect } from 'react';
import { message, Table, Tooltip, Button } from 'antd';
import { useStore } from 'src/Provider';
import actions from 'src/actions';
import Utils from 'src/utils';
const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '总算力/M',
    dataIndex: 'buyPower',
    key: 'buyPower',
  },
  {
    title: '单M收益/ETH',
    dataIndex: 'perMProfit',
    key: 'perMProfit',
  },
  {
    title: '单M单日电费/U',
    dataIndex: 'powerFeeMD',
    key: 'powerFeeMD',
  },
  {
    title: '总发放收益/ETH',
    dataIndex: 'todayProfit',
    key: 'todayProfit',
  },
  {
    title: '总发放人数',
    dataIndex: 'userNumber',
    key: 'userNumber',
  },
];
async function fetchData() {
  try {
    const data = await actions.getEthProfitSummaryHistory();
    return data;
  } catch (e) {
    message.warning(e.rawMessage || '异常：PHT431');
    return [];
  }
}
export default function ProfitHistoryTable(props) {
  const { showDraw, reloadPage } = props;
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
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
        columns={columns}
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
