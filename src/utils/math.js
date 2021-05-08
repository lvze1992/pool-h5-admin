import * as mathjs from 'mathjs';
import _ from 'lodash';
const config = {
  number: 'BigNumber',
  precision: 20,
};
const math = mathjs.create(mathjs.all, config);
export function calc(str) {
  try {
    return math.evaluate(str) + '';
  } catch (e) {
    return str || '异常: M08';
  }
}
export function formatAmount(value, precision) {
  const amount = calc(`${value} * 10 ^ ${precision}`).split('.')[0];
  if (_.isNumber(+amount) && amount) {
    return +amount;
  } else {
    // eslint-disable-next-line no-throw-literal
    throw { rawMessage: 'not number!' };
  }
}
