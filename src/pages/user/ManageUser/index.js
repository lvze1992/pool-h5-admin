import { Button, Form, message, Input, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import Actions from 'src/actions';
import { useStore } from 'src/Provider';
import { PageHeader } from 'src/components';
import Utils from 'src/utils';
import './style.scss';

const { Search } = Input;
const getColumns = () => [
  {
    title: '注册时间',
    dataIndex: 'date',
    key: 'date',
    render: (v, i) => {
      return Utils.dateFormat(i.user.createdAt, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: 'ID',
    dataIndex: 'objectId',
    key: 'objectId',
    render: (v, i) => {
      return i.user.objectId;
    },
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
  },
];
async function fetchData(phone) {
  try {
    if (phone) {
      const data = await Actions.queryAllUsers(phone);
      return data;
    } else {
      const data = await Actions.getAllUsers();
      return data;
    }
  } catch (e) {
    message.warning(e.rawMessage || '异常：PHT20');
    return [];
  }
}
export default function Market() {
  const store = useStore();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    (async function () {
      setLoading(true);
      const data = await fetchData(phone);
      setDataSource(data);
      setLoading(false);
    })();
  }, [phone]);

  return (
    <div className="manage-user">
      <PageHeader title="用户管理" />
      <div className="table-container">
        <Search
          placeholder="输入手机号"
          onChange={(e) => {
            setPhone(e.target.value);
          }}
          allowClear
          style={{
            width: 200,
          }}
        />
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
    </div>
  );
}
