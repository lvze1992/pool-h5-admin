import * as mathjs from 'mathjs';
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
