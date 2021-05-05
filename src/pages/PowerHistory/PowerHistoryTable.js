import React, { useState, useEffect } from 'react';
import { message, Table, Tooltip, Button } from 'antd';
import moment from 'moment';
import { useStore } from 'src/Provider';
import actions from 'src/actions';
import Utils from 'src/utils';
const getColumns = (chia) => [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '总算力/T',
    dataIndex: 'totalPower',
    key: 'totalPower',
  },
  {
    title: '有效算力/T',
    dataIndex: 'availablePower',
    key: 'availablePower',
  },
  {
    title: '当日收益/XCH',
    dataIndex: 'todayProfit',
    key: 'todayProfit',
  },
  {
    title: '单T收益/XCH',
    dataIndex: 'perTProfit',
    key: 'perTProfit',
  },
  {
    title: '累计收益/XCH',
    dataIndex: 'totalProfit',
    key: 'totalProfit',
    render: (v, i) => {
      const { rewrite } = i;
      if (rewrite) {
        return (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            <Tooltip title="管理员重写了总收益">
              <i className="iconfont icontishi" />
            </Tooltip>
            {v}
          </span>
        );
      }
      return v;
    },
  },
  // {
  //   title: '操作',
  //   dataIndex: 'operation',
  //   key: 'operation',
  //   render: (v, i) => {
  //     const { date } = i;
  //     const { closingDate } = chia.chiaConfig;
  //     const canModify = moment(date).isAfter(moment(closingDate));
  //     if (canModify) {
  //       return (
  //         <Button size="small" type="danger">
  //           修改
  //         </Button>
  //       );
  //     }
  //     return null;
  //   },
  // },
];
async function fetchData() {
  try {
    const data = await actions.getDayPower();
    return data;
  } catch (e) {
    message.warning(e.rawMessage || '异常：PHT20');
    return [];
  }
}
function calcTotal(data) {
  let total = 0;
  return data
    .reverse()
    .map((i) => {
      const { totalProfit, todayProfit } = i;
      const curTotalProfit = totalProfit ? totalProfit : Utils.calc(`${total}+${todayProfit || 0}`);
      total = curTotalProfit;
      return { ...i, totalProfit: curTotalProfit, rewrite: !!totalProfit };
    })
    .reverse();
}
export default function PowerHistoryTable(props) {
  const { showDraw, reloadPage } = props;
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const { chia } = useStore();
  useEffect(() => {
    (async function () {
      setLoading(true);
      const data = await fetchData();
      setDataSource(calcTotal(data));
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
