import AV from 'leancloud-storage';
import Utils from 'src/utils';
import _ from 'lodash';
import moment from 'moment';
class Actions {
  constructor() {
    AV.init({
      appId: '8Is6HVIchUuDTxfh14PaY4Uf-gzGzoHsz',
      appKey: 'ttG2vveJsC4ffIFuTdpplmxn',
      serverURL: 'https://8is6hvic.lc-cn-n1-shared.com',
    });
    localStorage.setItem('debug', 'leancloud*');
    this.AV = AV;
  }
  /**
   * 用户
   */
  async queryAllUsers(phone) {
    const user = new AV.Query('User');
    user.contains('mobilePhoneNumber', phone);
    const query = new AV.Query('UserInfo');
    query.matchesQuery('user', user);
    return (await query.find()).map((i) => i.toJSON());
  }
  async queryUser(phone) {
    if (phone) {
      const user = new AV.Query('User');
      user.equalTo('mobilePhoneNumber', phone);
      const query = new AV.Query('UserInfo');
      query.matchesQuery('user', user);
      const userInfo = await query.first();
      return userInfo;
    } else {
      const query = new AV.Query('UserInfo');
      query.equalTo('user', AV.User.current());
      const userInfo = await query.first();
      return userInfo;
    }
  }
  async getUserInfo(phone) {
    try {
      const userInfo = await this.queryUser(phone);
      return userInfo ? userInfo.toJSON() : {};
    } catch (e) {
      return {};
    }
  }
  async setUserInfo(data) {
    let userInfo = await this.queryUser();
    if (_.isEmpty(userInfo)) {
      // 设置用户信息
      userInfo = new AV.Object('UserInfo');
      userInfo.set('user', AV.User.current());
      userInfo.set('phone', AV.User.current().get('mobilePhoneNumber'));
    }
    Object.keys(data).forEach((key) => {
      userInfo.set(key, data[key]);
    });
    return await userInfo.save();
  }
  async hasTradePwd() {
    const query = new AV.Query('UserInfo');
    query.equalTo('user', AV.User.current());
    query.matches('tradePwd', new RegExp('[a-z]', 'i'));
    const userInfo = await query.first();
    return userInfo;
  }
  async verifyTradePwd(tradePwd) {
    const phone = AV.User.current().get('mobilePhoneNumber');
    const tradePwdEncrypt = Utils.hashIt(tradePwd + phone);
    const query = new AV.Query('UserInfo');
    query.equalTo('user', AV.User.current());
    query.equalTo('tradePwd', tradePwdEncrypt);
    const userInfo = await query.first();
    return userInfo;
  }
  async modifyTradePwd(tradePwd) {
    const userInfo = await this.queryUser();
    const phone = userInfo.get('phone');
    userInfo.set('tradePwd', Utils.hashIt(tradePwd + phone));
    await userInfo.save();
  }
  /**
   * chia 每日算力
   */
  async getChiaConfig() {
    try {
      const query = new AV.Query('ChiaWork');
      const r = await query.first();
      return r ? r.toJSON() : {};
    } catch (e) {
      return {};
    }
  }
  async getDayPower(date) {
    const query = new AV.Query('ChiaPower');
    query.descending('date');
    query.limit(1000);
    if (date) {
      query.equalTo('date', date);
    }
    const data = await query.find();
    return data.map((i) => {
      return i.toJSON();
    });
  }
  async insertDayPower(values, chiaConfig) {
    const { closingDate } = chiaConfig;
    const { date, totalPower, availablePower, todayProfit, perTProfit, totalProfit } = values;
    const dateStr = Utils.dateFormat(date);
    await this.closingLimit('ChiaWork', ['closingDate', dateStr]);
    const preDay = moment(dateStr).add(-1, 'day').format('YYYY-MM-DD');
    if (moment(preDay).isAfter(moment(closingDate))) {
      await this.preLimit('ChiaPower', ['date', preDay]);
    }
    await this.uniqLimit('ChiaPower', ['date', dateStr]);
    const ChiaPower = new AV.Object('ChiaPower');
    ChiaPower.set('date', dateStr);
    ChiaPower.set('totalPower', totalPower);
    ChiaPower.set('availablePower', availablePower);
    ChiaPower.set('todayProfit', todayProfit);
    ChiaPower.set('perTProfit', perTProfit);
    ChiaPower.set('totalProfit', totalProfit);
    // 将对象保存到云端
    return await ChiaPower.save();
  }
  async insertUserBuy(values, chiaConfig) {
    const { startDay, endDay } = chiaConfig;
    const { buyPower, buyPowerCost, date, userId } = values;
    const dateStr = Utils.dateFormat(date);
    const user = AV.Object.createWithoutData('User', userId);
    await this.closingLimit('ChiaWork', ['closingDate', dateStr]);
    const ChiaUserBuy = new AV.Object('ChiaUserBuy');
    ChiaUserBuy.set('date', dateStr);
    // TODO check
    const startDate = moment(`${dateStr} 00:00:00`).add(1, 'day').add(startDay, 'day').format('YYYY-MM-DD HH:mm:ss');
    ChiaUserBuy.set('startDate', startDate);
    const endDate = moment(startDate).add(endDay, 'day').format('YYYY-MM-DD HH:mm:ss');
    ChiaUserBuy.set('endDate', endDate);
    ChiaUserBuy.set('user', user);
    ChiaUserBuy.set('verifier', AV.User.current());
    ChiaUserBuy.set('buyPower', buyPower);
    ChiaUserBuy.set('buyPowerCost', buyPowerCost);
    return await ChiaUserBuy.save();
  }
  async getUserBuyAll() {
    let allList = [];
    let limit = 1000;
    let skip = 0;
    let userBuyList = await this.getUserBuy(limit, skip);
    allList = allList.concat(userBuyList);
    while (userBuyList.length === limit) {
      skip = skip + limit;
      userBuyList = await this.getUserBuy(limit, skip);
      allList = allList.concat(userBuyList);
    }
    return allList;
  }
  async getUserBuy(limit = 100, skip = 0) {
    const query = new AV.Query('ChiaUserBuy');
    query.descending('date');
    query.include('user');
    query.include('verifier');
    query.limit(limit);
    query.skip(skip);
    const data = await query.find();
    return data.map((i) => {
      const user = i.get('user');
      const verifier = i.get('verifier');
      const data = i.toJSON();
      return { ...data, user: user ? user.toJSON() : user, verifier: verifier ? verifier.toJSON() : verifier };
    });
  }
  async getUserBuyProfit(objectId) {
    const chiaUserBuy = AV.Object.createWithoutData('ChiaUserBuy', objectId);
    const query = new AV.Query('ChiaUserProfitList');
    query.equalTo('chiaUserBuy', chiaUserBuy);
    const data = await query.find();
    return data.map((i) => {
      return i.toJSON();
    });
  }
  /**
   * 收益
   */
  async publishUserProfit(values, chiaConfig) {
    const { profitList, profitSummary } = values;
    const { closingDate } = chiaConfig;
    const { date: dateStr } = profitSummary;
    await this.closingLimit('ChiaWork', ['closingDate', dateStr]);
    const preDay = moment(dateStr).add(-1, 'day').format('YYYY-MM-DD');
    if (moment(preDay).isAfter(moment(closingDate))) {
      await this.preLimit('ChiaUserProfitSummary', ['date', preDay]);
    }
    await this.uniqLimit('ChiaUserProfitSummary', ['date', dateStr]);
    // 1 更新ChiaUserProfitSummary
    const chiaProfitSummary = new AV.Object('ChiaUserProfitSummary');
    const chiaProfitSummaryKeys = ['availablePower', 'buyPower', 'todayProfit', 'userNumber', 'perTProfit', 'date'];
    chiaProfitSummaryKeys.forEach((key) => {
      chiaProfitSummary.set(key, profitSummary[key]);
    });
    chiaProfitSummary.set('verifier', AV.User.current());
    // 2 更新ChiaProfitList
    const chiaProfitListKeys = ['buyPower', 'availablePower', 'waitpPower', 'todayProfit', 'totalProfit', 'perTProfit', 'date'];
    const profitListFetches = [];
    profitList.forEach((i) => {
      const { totalProfit, userBuyObjectId } = i;
      const userBuyObject = AV.Object.createWithoutData('ChiaUserBuy', userBuyObjectId);
      // 3 更新ChiaUserBuy
      userBuyObject.set('totalProfit', totalProfit);
      profitListFetches.push(userBuyObject);
      const chiaProfitList = new AV.Object('ChiaUserProfitList');
      chiaProfitListKeys.forEach((key) => {
        chiaProfitList.set(key, i[key]);
      });
      chiaProfitList.set('chiaUserBuy', userBuyObject);
      const user = AV.Object.createWithoutData('User', i.user.objectId);
      chiaProfitList.set('user', user);
      chiaProfitList.set('verifier', AV.User.current());
      profitListFetches.push(chiaProfitList);
    });
    return await AV.Object.saveAll([chiaProfitSummary, ...profitListFetches]);
  }
  async getChiaProfitSummaryHistory() {
    const query = new AV.Query('ChiaUserProfitSummary');
    query.descending('date');
    const data = await query.find();
    return data.map((i) => {
      return i.toJSON();
    });
  }
  /**
   * 限制
   */
  // 前置日期限制
  async preLimit(table, limit) {
    const [key, value] = limit;
    const query = new AV.Query(table);
    query.equalTo(key, value);
    const exist = await query.first();
    if (!exist) {
      // eslint-disable-next-line no-throw-literal
      throw { rawMessage: `请先添加${value}的数据` };
    }
  }
  // 记录唯一性
  async uniqLimit(table, limit) {
    const [key, value] = limit;
    const query = new AV.Query(table);
    query.equalTo(key, value);
    const exist = await query.first();
    if (exist) {
      // eslint-disable-next-line no-throw-literal
      throw { rawMessage: '已添加过该日记录 或 记录不唯一' };
    }
  }
  // 结算日期限制
  async closingLimit(table, limit) {
    const [key, value] = limit;
    const query = new AV.Query(table);
    const config = await query.first();
    const { closingDate } = config.toJSON();
    const isAfter = moment(value).isAfter(moment(closingDate));
    if (!isAfter) {
      // eslint-disable-next-line no-throw-literal
      throw { rawMessage: '不能修改已结算日期前的数据' };
    }
  }
}
export default new Actions();
