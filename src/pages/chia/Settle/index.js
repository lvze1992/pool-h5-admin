import { Button, DatePicker, message, Modal } from 'antd';
import React, { useState } from 'react';
import Actions from 'src/actions';
import { useStore } from 'src/Provider';
import { PageHeader } from 'src/components';
import './style.scss';
const { confirm } = Modal;
function settleChiaDay(date, store) {
  confirm({
    title: `确认结算${date}?`,
    content: <div>我确认{date}的数据已核实无误，点击确认后，您将无法插入或修改结算日之前（包括结算日）的数据</div>,
    onOk: async () => {
      try {
        await Actions.settleChiaDay(date);
        message.success('结算成功');
        const chiaConfig = await Actions.getChiaConfig();
        store.setChiaConfig(chiaConfig);
      } catch (e) {
        message.warning(e.rawMessage || '异常：S16');
      }
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}
export default function Settle() {
  const [reloadPage, setReload] = useState(0);
  const [date, setDate] = useState('');
  const store = useStore();
  return (
    <div className="settle-page">
      <PageHeader title="chia矿池结算" />
      <div className="line">
        <DatePicker
          onChange={(date) => {
            setDate(date.format('YYYY-MM-DD'));
          }}
        />
        <Button
          type="danger"
          onClick={() => {
            settleChiaDay(date, store);
          }}
          disabled={!date}
        >
          结算
        </Button>
      </div>
    </div>
  );
}
