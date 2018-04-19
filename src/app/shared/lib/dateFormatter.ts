import * as moment from 'jalali-moment';

export function dateFormatter(d) {
  const date = moment(d);
  return [
    [date.jDate(), date.jMonth() + 1,  date.jYear()].map(r => r.toLocaleString('fa', {useGrouping: false})).join(' / '),
    [date.hour(), date.minute(), date.second()].map( r => (r < 10 ? '۰' : '') + r.toLocaleString('fa', {useGrouping: false})).join(':')
  ];
}