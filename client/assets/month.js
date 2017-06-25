var Moment = require('moment');
var momentRange = require('moment-range');
const moment = momentRange.extendMoment(Moment);

export default class Month {
  constructor (month, year) {
    this.start = moment([year, month]);
    this.end = this.start.clone().endOf('month');
    this.month = month;
    this.year = year;
  }

  getWeekStart () {
    return this.start.weekday();
  }

  getDays () {
    return Array.from(moment.range(this.start, this.end).by('days')) ;
  }

  getFormatted () {
    return this.start.format('MMMM YYYY');
  }

  getWeeks () {
    return this.end.week() - this.start.week() + 1;
  }

  getYears () {
    const start = moment([this.start.year() - 50, 0]);
    const end = moment([this.start.year() + 50, 0]);

    return Array.from(moment.range(start, end).by('years'));
  }
}

export function getWeekDays (lang) {
  const days = [];

  moment.locale(lang);

  for (let i = 0; i < 7; i++) days.push(moment().weekday(i).format('dd'));

  return days;
}
