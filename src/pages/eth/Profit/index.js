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
function useProfitList(store, { perMProfit, powerFeeMD, ManageFee, date }) {
  const [profitList, setProfitList] = useState([]);
  const [profitSummary, setProfitSummary] = useState({});
  useEffect(() => {
    (async function () {
      const ethConfig = store.eth.ethConfig;
      if (_.isEmpty(ethConfig) || !perMProfit || !date || !_.get(store, 'price.ETH')) {
        setProfitList([]);
        return;
      }
      const EthPrice = _.get(store, 'price.ETH').split(' ')[0];
      // 获取所有 用户购买记录
      const allBuyList = await Actions.getUserBuyEthAll();
      const allProduceList = Utils.calcEthProduce(allBuyList, ethConfig, { perMProfit, powerFeeMD, EthPrice, ManageFee, date });
      setProfitList(allProduceList);
      const profitSummary = Utils.calcEthProduceSummary(allProduceList, { perMProfit, powerFeeMD, ManageFee, date });
      setProfitSummary(profitSummary);
    })();
  }, [store.eth.ethConfig, perMProfit, ManageFee, powerFeeMD, date]);
  return { profitList, profitSummary, profitDate: date };
}
function usePerMProfit(date) {
  const [EthDayPower, setEthDayPower] = useState('');
  useEffect(() => {
    (async function () {
      if (!date) {
        return;
      }
      const dayPower = await Actions.getEthDayPower(date);
      setEthDayPower(_.get(dayPower, '[0]', {}));
    })();
  }, [date]);
  return EthDayPower;
}
export default function Profit() {
  const history = useHistory();
  const store = useStore();
  const [reloadPage, setReload] = useState(0);
  const [date, setDate] = useState();
  const [showDraw, setShowDraw] = useState(false);
  const { perMProfit, powerFeeMD, ManageFee } = usePerMProfit(date);
  let { profitList, profitSummary, profitDate } = useProfitList(store, { perMProfit, powerFeeMD, ManageFee, date });
  if (!perMProfit || !date) {
    profitList = [];
    profitSummary = {};
  }
  return (
    <div className="profit-page">
      <PageHeader
        title="收益发放"
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
      {showDraw ? (
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
          <UserProfitForm setDate={setDate} setShowDraw={setShowDraw} perMProfit={perMProfit} profitDate={profitDate} profitList={profitList} profitSummary={profitSummary} />
        </Drawer>
      ) : null}
    </div>
  );
}
