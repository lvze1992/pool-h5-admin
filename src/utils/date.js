import moment from 'moment';
import _ from 'lodash';
const DATE_FORMAT = 'YYYY-MM-DD';
export function dateFormat(time, format = DATE_FORMAT) {
  if (!time) {
    return '-';
  }
  if (_.isNaN(+time)) {
    return moment(time).format(format);
  }
  return moment(+time).format(format);
}
