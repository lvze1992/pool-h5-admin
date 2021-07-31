import React, { useState } from 'react';
import { Input, Button, DatePicker, message, Tooltip, Table, Modal } from 'antd';
import { Link } from 'react-router-dom';
import Actions from 'src/actions';
import { useStore } from 'src/Provider';
import { _ } from 'globalthis/implementation';
const { confirm } = Modal;
function Item(props) {
  const { label, children } = props;
  return (
    <div className="item">
      <span className="key">{label || ''}</span>
      <div className="value">{children || '-'}</div>
    </div>
  );
}
const commonRender = (v, i) => {
  return (
    <Tooltip title={v}>
      <span className="overflow-text">{v}</span>
    </Tooltip>
  );
};
const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '用户',
    dataIndex: 'username',
    key: 'username',
    render: (v, i) => {
      return _.get(i, 'user.username', '-');
    },
  },
  {
    title: '有效算力',
    dataIndex: 'availablePower',
    key: 'availablePower',
    render: commonRender,
  },
  {
    title: '当日挖矿净收益/ETH',
    dataIndex: 'todayProfit',
    key: 'todayProfit',
    render: commonRender,
  },
  {
    title: '累计挖矿净收益/ETH',
    dataIndex: 'totalProfit',
    key: 'totalProfit',
    render: commonRender,
  },
  {
    title: '单M收益/ETH',
    dataIndex: 'perMProfit',
    key: 'perMProfit',
    render: commonRender,
  },
  {
    title: '单M单日电费/U',
    dataIndex: 'powerFeeMD',
    key: 'powerFeeMD',
    render: commonRender,
  },
];
const onFinish = async (values, { setShowDraw, store }) => {
  try {
    const token = store.tokens.filter(({ token }) => token === 'ETH')[0];
    await Actions.publishUserProfitEth(values, token, store.eth.ethConfig);
    message.success('添加成功');
    setShowDraw(false);
  } catch (e) {
    message.warning(e.rawMessage || '异常：PHF76');
  }
};

export default function UserHistoryForm(props) {
  const [loading, setLoading] = useState(false);
  const store = useStore();
  const { setShowDraw, profitDate, profitList, profitSummary, perMProfit, setDate } = props;
  const { availablePower, buyPower, todayProfit, userNumber } = profitSummary;
  return (
    <div className="userProfit-form">
      <div className="form-container">
        <Item label="发放日期：">
          <DatePicker
            onChange={(date) => {
              setDate(date.format('YYYY-MM-DD'));
            }}
          />
        </Item>
        <Item label="总发放收益/ETH：">{todayProfit}</Item>
        <Item label="总发放人数：">{userNumber}</Item>
        <Item label="有效算力/M：">{availablePower}</Item>
        <Item label="单M收益/ETH：">
          {perMProfit ? (
            perMProfit
          ) : profitDate ? (
            <Link to="/eth/powerHistory">
              <span className="alert">前去添加{profitDate}的单M收益</span>
            </Link>
          ) : (
            '-'
          )}
        </Item>
        <Item>
          <Button
            type="primary"
            disabled={!profitDate || loading || !perMProfit}
            onClick={() => {
              const { date } = profitSummary;
              confirm({
                title: '确认发放?',
                content: (
                  <div>
                    您将发放 <span style={{ color: 'red' }}>{date}</span> 的收益。
                    <br />
                    我确认总发放收益无误
                  </div>
                ),
                onOk() {
                  onFinish(
                    {
                      profitList,
                      profitSummary,
                    },
                    { setShowDraw, store },
                  );
                },
                onCancel() {
                  console.log('Cancel');
                },
              });
            }}
          >
            发放 <b>{profitDate}</b> 收益
          </Button>
        </Item>
      </div>
      <div className="table-container">
        <Table
          dataSource={profitList}
          columns={columns}
          size="small"
          scroll={{
            x: 'max-content',
          }}
        />
      </div>
    </div>
  );
}
