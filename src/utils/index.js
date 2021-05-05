import * as dateUtil from './date.js';
import * as crypto from './crypto.js';
import * as math from './math.js';
import * as produce from './produce.js';
function formatPhone(phone, code) {
  const countryCode = code.split('_')[0];
  return `+${countryCode}${phone}`;
}
const utils = { ...dateUtil, ...crypto, ...math, ...produce, formatPhone };
export default utils;
