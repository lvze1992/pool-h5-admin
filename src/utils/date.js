import moment from 'moment';
const DATE_FORMAT = 'YYYY-MM-DD';
export function dateFormat(time) {
  if (!time) {
    return '-';
  }
  return moment(+time).format(DATE_FORMAT);
}
