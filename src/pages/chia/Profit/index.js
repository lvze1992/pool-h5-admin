import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStore } from 'src/Provider';
import { Button, Drawer } from 'antd';
import Actions from 'src/actions';
import { PageHeader } from 'src/components';
import _ from 'lodash';
import UserProfitForm from './UserProfitForm';
import ProfitHistoryTable from './ProfitHistoryTable';
import moment from 'moment';
import Utils from 'src/utils';
import './style.scss';
function useProfitList(store, perTProfit, date) {
  const [profitList, setProfitList] = useState([]);
  const [profitSummary, setProfitSummary] = useState({});
  useEffect(() => {
    (async function () {
      const chiaConfig = store.chia.chiaConfig;
      if (_.isEmpty(chiaConfig) || !perTProfit || !date) {
        setProfitList([]);
        return;
      }
      // 获取所有 用户购买记录
      const allBuyList = await Actions.getUserBuyChiaAll();
      const allProduceList = Utils.calcChiaProduce(allBuyList, chiaConfig, perTProfit, date);
      setProfitList(allProduceList);
      const profitSummary = Utils.calcChiaProduceSummary(allProduceList, perTProfit, date);
      setProfitSummary(profitSummary);
    })();
  }, [store.chia.chiaConfig, perTProfit, date]);
  return { profitList, profitSummary, profitDate: date };
}
function usePerTProfit(date) {
  const [perTProfit, setPerTProfit] = useState('');
  useEffect(() => {
    (async function () {
      if (!date) {
        return;
      }
      const dayPower = await Actions.getChiaDayPower(date);
      setPerTProfit(_.get(dayPower, '[0].perTProfit'));
    })();
  }, [date]);
  return { perTProfit };
}
export default function Profit() {
  const history = useHistory();
  const store = useStore();
  const [reloadPage, setReload] = useState(0);
  const [date, setDate] = useState();
  const [showDraw, setShowDraw] = useState(false);
  const { perTProfit } = usePerTProfit(date);
  let { profitList, profitSummary, profitDate } = useProfitList(store, perTProfit, date);
  if (!perTProfit || !date) {
    profitList = [];
    profitSummary = {};
  }
  return (
    <div className="profit-page">
      <PageHeader
        title="用户购买添加"
        extra={[
          <div
            className="ghost-button"
            onClick={() => {
              setReload(Date.now());
            }}
          >
            <i className="iconfont iconshuaxin" />
          </div>,
          <Button
            key="1"
            type="primary"
            onClick={() => {
              setShowDraw(true);
            }}
          >
            收益发放
          </Button>,
        ]}
      />
      <ProfitHistoryTable showDraw={showDraw} reloadPage={reloadPage} setShowDraw={setShowDraw} />
      <Drawer
        width={'1000px'}
        title="收益发放"
        placement="right"
        closable={false}
        onClose={() => {
          setShowDraw(false);
        }}
        visible={showDraw}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <UserProfitForm setDate={setDate} setShowDraw={setShowDraw} perTProfit={perTProfit} profitDate={profitDate} profitList={profitList} profitSummary={profitSummary} />
      </Drawer>
    </div>
  );
}
