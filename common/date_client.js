/* eslint-disable no-param-reassign */
const moment = require('moment');

const dateClient = {
  dateTime: () => moment().format('YYYYMMDDHHmmss'),
  nowDate: () => moment().format('YYYY-MM-DD'),
  nowDateTime: () => moment().format('YYYY-MM-DD HH:mm:ss'),
  timeBeiJingStringToUTC: (time, format) => moment(time).utcOffset(-8).format(format),
  timeESTToUTC: (time) => moment(time).utcOffset(5).format('YYYY-MM-DD HH:mm:ss'),
  timeUTCToEST: (time) => moment(time).utcOffset(-5).format('YYYY-MM-DD HH:mm:ss'),
  convertTime: (time) => moment(time).utcOffset(0).format('YYYY-MM-DD HH:mm:ss'),
  convertTimestamp: (time) => (time ? moment(time).utcOffset(0).unix() : null),
  convertTimestampMS: (time) => (time ? moment(time).utcOffset(0).valueOf() : null),
  compareTime: (startTime, endTime = null, range = 'seconds') => {
    if (!endTime) {
      endTime = Date.now();
    }
    return moment(endTime).diff(moment(startTime), range);
  },
  timeAddMonths: (time, months) => moment(time).utcOffset(0).add(months, 'M').unix(),
  timeAddYears: (time, years) => moment(time).utcOffset(0).add(years, 'Y').unix(),
};

module.exports = dateClient;
