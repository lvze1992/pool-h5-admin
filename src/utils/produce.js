import moment from 'moment';
import _ from 'lodash';
import * as U from './math';
export function calcChiaProduce(list, chiaConfig, perTProfit, date) {
  // list 购买记录 => 收益记录
  const { totalPday } = chiaConfig;
  const date1 = moment(`${date} 00:00:00`);
  const date2 = moment(`${date} 24:00:00`);
  let avaList = list.filter(({ startDate, endDate }) => {
    return moment(startDate).isSameOrBefore(date1) && moment(endDate).isSameOrAfter(date2);
  });
  return avaList.map(({ user, buyPower, objectId, startDate, totalProfit = 0 }, idx) => {
    const days = Math.min(+moment(date2).diff(moment(startDate), 'day'), totalPday);
    const availablePower = U.calc(`${buyPower} * ${days} / ${totalPday}`);
    const todayProfit = U.calc(`${availablePower} * ${perTProfit} * 0.8`);
    const nextTotalProfit = U.calc(`${totalProfit} + ${todayProfit}`);
    const waitpPower = U.calc(`${buyPower} - ${availablePower}`);
    return {
      userBuyObjectId: objectId,
      user,
      buyPower,
      availablePower,
      waitpPower,
      todayProfit,
      totalProfit: nextTotalProfit,
      perTProfit,
      date,
      key: idx,
    };
  });
}

export function calcChiaProduceSummary(list, perTProfit, date) {
  // 汇总收益记录
  let _availablePower = '0',
    _buyPower = '0',
    _todayProfit = '0',
    _userNumber = [];
  list.forEach((i) => {
    const { availablePower, buyPower, todayProfit } = i;
    const username = _.get(i, 'user.username', '');
    _availablePower = U.calc(`${_availablePower} + ${availablePower}`);
    _buyPower = U.calc(`${_buyPower} + ${buyPower}`);
    _todayProfit = U.calc(`${_todayProfit} + ${todayProfit}`);
    _userNumber = _.uniq(_userNumber.concat(username));
  });
  return {
    availablePower: _availablePower,
    buyPower: _buyPower,
    todayProfit: _todayProfit,
    userNumber: _userNumber.length,
    perTProfit,
    date,
  };
}

export function calcEthProduce(list, ethConfig, { perMProfit, EthPrice, powerFeeMD, ManageFee, date }) {
  // list 购买记录 => 收益记录
  const {} = ethConfig;
  const date1 = moment(`${date} 00:00:00`);
  const date2 = moment(`${date} 24:00:00`);
  let avaList = list.filter(({ startDate, endDate }) => {
    return moment(startDate).isSameOrBefore(date1) && moment(endDate).isSameOrAfter(date2);
  });
  return avaList.map(({ user, buyPower, objectId, startDate, totalProfit = 0 }, idx) => {
    const todayProfit = U.calc(`${buyPower} * (${perMProfit} - ${powerFeeMD}/${EthPrice}) * (1 - ${ManageFee})`);
    const nextTotalProfit = U.calc(`${totalProfit} + ${todayProfit}`);
    return {
      userBuyObjectId: objectId,
      user,
      buyPower,
      availablePower: buyPower,
      todayProfit,
      totalProfit: nextTotalProfit,
      perMProfit,
      powerFeeMD,
      date,
      key: idx,
    };
  });
}

export function calcEthProduceSummary(list, { perMProfit, powerFeeMD, ManageFee, date }) {
  // 汇总收益记录
  let _availablePower = '0',
    _buyPower = '0',
    _todayProfit = '0',
    _userNumber = [];
  list.forEach((i) => {
    const { availablePower, buyPower, todayProfit } = i;
    const username = _.get(i, 'user.username', '');
    _availablePower = U.calc(`${_availablePower} + ${availablePower}`);
    _buyPower = U.calc(`${_buyPower} + ${buyPower}`);
    _todayProfit = U.calc(`${_todayProfit} + ${todayProfit}`);
    _userNumber = _.uniq(_userNumber.concat(username));
  });
  return {
    date,
    todayProfit: _todayProfit,
    userNumber: _userNumber.length,
    buyPower: _buyPower,
    availablePower: _availablePower,
    perMProfit,
    powerFeeMD,
  };
}
