import React, { useState, useEffect } from 'react';
import { message, Table, Tooltip, Button, Modal } from 'antd';
import { Qrcode } from 'src/components';
import { useStore } from 'src/Provider';
import actions from 'src/actions';
import Utils from 'src/utils';
const { confirm } = Modal;
async function confirmWithdraw(withdrawId, { setReload }) {
  confirm({
    title: '确认提现?',
    content: <div>我确认已完成提币</div>,
    onOk: async () => {
      try {
        await actions.confirmWithdraw(withdrawId);
        setReload && setReload();
      } catch (e) {
        console.log('e', e);

        message.warning(e.rawMessage || '异常：WHT16');
      }
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
const getColumns = (chia, { setReload }) => [
  {
    title: '发起时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (v) => {
      console.log('vvv', v);

      return Utils.dateFormat(v, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '用户',
    dataIndex: 'user',
    key: 'user',
    render: (v) => {
      return v.username;
    },
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    render: (v, i) => {
      const { user, lock, withdrawFee, token } = i;
      const amount = Utils.calc(`${lock} / 10 ^ ${token.precision} - ${withdrawFee}`);
      return (
        <Tooltip title={<Qrcode text={v} title={`${user.username}提现${amount} ${token.token}`} />}>
          <div
            style={{
              maxWidth: '200px',
            }}
          >
            {v}
          </div>
        </Tooltip>
      );
    },
  },
  {
    title: '提笔数量',
    dataIndex: 'lock',
    key: 'lock',
    render: (v, i) => {
      const { lock, withdrawFee, token } = i;
      return Utils.calc(`${lock} / 10 ^ ${token.precision} - ${withdrawFee}`);
    },
  },
  {
    title: '手续费',
    dataIndex: 'withdrawFee',
    key: 'withdrawFee',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (v, i) => {
      const statusMap = {
        doing: '待处理',
        done: '已完成',
      };
      return statusMap[v] || '-';
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    render: (v, i) => {
      if (i.status === 'doing') {
        return (
          <Button
            size="small"
            type="danger"
            onClick={() => {
              confirmWithdraw(i.objectId, { setReload });
            }}
          >
            标记
          </Button>
        );
      }
    },
  },
];
async function fetchData() {
  try {
    const data = await actions.getWithdrawHistory();
    return data;
  } catch (e) {
    message.warning(e.rawMessage || '异常：WHT20');
    return [];
  }
}
export default function PowerHistoryTable(props) {
  const { showDraw, reloadPage, setReload } = props;
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
        columns={getColumns(chia, { setReload })}
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
