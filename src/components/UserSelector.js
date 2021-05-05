import React, { useState } from 'react';
import { Select, message } from 'antd';
import Actions from 'src/actions';
const { Option } = Select;
let timer = null;
function fetchUser(value, cb) {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    try {
      const users = await Actions.queryAllUsers(value);
      cb(users);
    } catch (e) {
      message.warning(e.rawMessage || '异常：US10');
      cb([]);
    }
  }, 200);
}
export default function UserSelector(props) {
  const [value, handleChange] = useState('');
  const [users, setUsers] = useState([]);
  const options = users.map((d) => <Option key={d.user.objectId}>{d.phone}</Option>);
  return (
    <Select
      showSearch
      value={value}
      placeholder="输入手机号搜索"
      defaultActiveFirstOption={false}
      filterOption={false}
      onSearch={(value) => {
        fetchUser(value, (users) => {
          setUsers(users);
        });
      }}
      onChange={(value) => {
        props.onChange(value);
        handleChange(value);
      }}
      notFoundContent={null}
    >
      {options}
    </Select>
  );
}
