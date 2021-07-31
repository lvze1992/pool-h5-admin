import React, { useState, useEffect } from 'react';
import { message, Table, Tooltip, Button } from 'antd';
import moment from 'moment';
import { useStore } from 'src/Provider';
import actions from 'src/actions';
import Utils from 'src/utils';
const getColumns = () => [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '总算力/M',
    dataIndex: 'totalPower',
    key: 'totalPower',
  },
  {
    title: '当日收益/ETH',
    dataIndex: 'todayProfit',
    key: 'todayProfit',
  },
  {
    title: '单M收益/ETH',
    dataIndex: 'perMProfit',
    key: 'perMProfit',
  },
  {
    title: '单M功耗/w',
    dataIndex: 'perMPowerCost',
    key: 'perMPowerCost',
  },
  {
    title: '电费 元/KWH',
    dataIndex: 'powerFee',
    key: 'powerFee',
  },
  {
    title: '单M单日电费/U',
    dataIndex: 'powerFeeMD',
    key: 'powerFeeMD',
  },
  {
    title: '管理费',
    dataIndex: 'ManageFee',
    key: 'ManageFee',
  },
  {
    title: '累计收益/ETH',
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
  //     const { closingDate } = .chiaConfig;
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
    const data = await actions.getEthDayPower();
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
        columns={getColumns()}
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
