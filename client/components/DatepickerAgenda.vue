<template>
  <transition name="datepicker-slide">
    <div class="datepicker"
         :class="[isDoubled, classOrientation]"
         @click.stop
         v-if="show">

      <div class="datepicker-header"
           :class="[classOrientation]">
        <span class="date-title" :class="{selected:selectedBookend === CONSTANTS.START}"
        @click="switchSelectedBookend(CONSTANTS.START)">Start Date</span>
        <div class="datepicker-year" @click="showOrHideYears">
          <transition-group name="slideh">
                        <span v-for="year in [year]"
                              :class="dayDirection"
                              :key="year">
                            {{ year }}
                        </span>
          </transition-group>
        </div>
        <div class="datepicker-date"
             :class="[classOrientation]">
          <transition-group name="slideh">
                        <span v-for="dateFormatted in [startDateFormatted]"
                              :class="[dayDirection]"
                              :key="dateFormatted">
                            {{ dateFormatted }}
                        </span>
          </transition-group>
        </div>
        <span class="date-title" :class="{selected:selectedBookend === CONSTANTS.END}"
              @click="switchSelectedBookend(CONSTANTS.END)">End Date</span>
        <div class="datepicker-year" @click="showOrHideYears">
          <transition-group name="slideh">
                        <span v-for="year in [year]"
                              :class="dayDirection"
                              :key="year">
                            {{ year }}
                        </span>
          </transition-group>
        </div>
        <div class="datepicker-date"
             :class="[classOrientation]">
          <transition-group name="slideh">
                        <span v-for="dateFormatted in [endDateFormatted]"
                              :class="[dayDirection]"
                              :key="dateFormatted">
                            {{ dateFormatted }}
                        </span>
          </transition-group>
        </div>
      </div>

      <div class="datepicker-body"
           :class="[classOrientation]">
        <div class="datepicker-controls"
             :class="[isDoubled, classOrientation]">
          <button class="datepicker-next" @click="nextMonth">
            <svg class="datepicker-arrow" xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                 viewBox="0.5 900.5 30 30" enable-background="new 0.5 900.5 30 30">
              <path
                d="M8.779 928.31c-.473.567-.396 1.406.171 1.88.566.474 1.409.396 1.881-.17l11.391-13.664c.208-.247.31-.551.31-.855 0-.304-.103-.607-.31-.855l-11.391-13.666c-.472-.566-1.315-.644-1.881-.17-.565.473-.643 1.313-.171 1.881l10.679 12.809-10.679 12.81z"/>
            </svg>
          </button>
          <button class="datepicker-prev" @click="prevMonth">
            <svg class="datepicker-arrow" xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                 viewBox="0.5 900.5 30 30" enable-background="new 0.5 900.5 30 30">
              <path
                d="M22.221 928.31l-10.679-12.81 10.679-12.809c.472-.567.395-1.408-.171-1.881-.565-.474-1.409-.396-1.881.17l-11.39 13.665c-.208.248-.31.552-.31.855 0 .305.103.608.31.855l11.391 13.664c.472.566 1.315.644 1.881.17.566-.473.643-1.312.17-1.879z"/>
            </svg>
          </button>
        </div>

        <div class="datepicker-month" v-for="month in months">
          <transition-group name="slidev">
            <div class="datepicker-month-label"
                 v-for="month in [month]"
                 :class="classDirection"
                 :key="month">
              {{ month.getFormatted() }}


            </div>
          </transition-group>

          <div class="datepicker-week">
            <div class="datepicker-weekday"
                 v-for="day in weekDays"
                 track-by="$index">
              {{ day }}


            </div>
          </div>

          <div class="datepicker-days">
            <transition-group name="slidev">
              <div v-for="month in [month]"
                   :class="classDirection"
                   :key="month">
                <div class="datepicker-day"
                     :style="{ width: (month.getWeekStart() * 41) + 'px' }">
                </div>

                <div class="datepicker-day"
                     :class="{
                       selected: isSelected(day),
                       today: isToday(day),
                       between: isBetween(day),
                       start: isStartSelected(day),
                       end: isEndSelected(day),
                       saturday:isSaturday(day),
                       sunday:isSunday(day)}"
                     v-for="day in month.getDays()"
                     @click="selectDate(day)"
                     :disabled="isDisabled(day)"
                     :data-day=" day.format('D')">
                  <span class="datepicker-day-effect"></span>
                  <span class="datepicker-day-text">{{ day.format('D') }}</span>
                </div>
              </div>
            </transition-group>
          </div>
        </div>

        <div class="datepicker-years"
             :class="[isDoubled, classOrientation]"
             v-show="yearsVisible"
             transition="fade">
          <div class="datepicker-years-content">
            <div class="datepicker-year"
                 v-for="year in years"
                 :class="classYear(year)"
                 @click="selectYear(year)">
              {{ year.year() }}


            </div>
          </div>
        </div>

        <div class="datepicker-actions">
          <button @click="cancel()">{{ language[1] }}</button>
          <button @click="submitDay()">{{ language[0] }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import moment from 'moment';
  import month from '../assets/month.js';
  import * as monthClasses from '../assets/month.js';
  const CONSTANTS = {
    START: 'START',
    END: 'END'
  }
  export default {
    name: 'datepicker-agenda',
    props: {
      initialDate: {
        type: Object,
        default() {
          return moment();
        }
      },
      disablePassedDays: {type: Boolean, default: false},
      disabledDays: {
        type: Array, default() {
          return []
        }
      },
      doubled: {type: Boolean, default: false},
      lang: {type: String, default: 'en'},
      orientation: {type: String, default: 'portrait'},
      show: {type: Boolean, required: true}
    },
    data() {
      return {
        CONSTANTS,
        selectedBookend: CONSTANTS.START,
        startDate: '',
        endDate: '',
        weekDays: monthClasses.getWeekDays(this.lang),
        months: [],
        classDirection: 'off',
        dayDirection: 'off',
        yearsVisible: false,
        years: null
      };
    },
    computed: {
      year() {
        return this.startDate.format('YYYY');
      },
      startDateFormatted() {
        return this.startDate.format('ddd') + ', ' + this.startDate.format('MMMM DD');
      },
      endDateFormatted() {
        return this.endDate.format ? this.endDate.format('ddd') + ', ' + this.endDate.format('MMMM DD') : '';
      },
      classOrientation() {
        return this.orientation;
      },
      isDoubled() {
        if (this.doubled) return 'double';
        return '';
      },
      language() {
        let tmp = ['ok', 'cancel'];
        return tmp;
      }
    },
    watch: {
      show(val, oldval) {
        if (val === false) {
          this.classDirection = 'off';
          this.dayDirection = 'off';
        } else {
          let newDate = moment([this.startDate.year(), this.startDate.month(), this.startDate.date()]);
          this.startDate = newDate.clone();
        }
      },
      yearsVisible(val, oldval) {
        let scrollOffset = (this.startDate.year() - this.years[0].year()) * 40 - 130;
        $('.datepicker-years').scrollTop(scrollOffset);
      }
    },
    created() {
      this.startDate = this.initialDate.clone();
    },
    mounted() {
      this.$nextTick(() => {
        this.setMonths();
        this.years = this.months[0].getYears();
      });
    },
    methods: {
      classYear(year) {
        if (year.year() == this.startDate.year()) return 'selected';
        else return '';
      },
      isDisabled(day) {
        if (this.disabledDays.length > 0)
          for (let i = 0; i < this.disabledDays.length; i++)
            if (moment(this.disabledDays[i], 'YYYY-MM-D').startOf('day').unix() === day.startOf('day').unix()) return true

        if (this.disablePassedDays) return day < moment().startOf('day');
        return false;
      },
      isStartSelected(day) {
        return this.startDate.unix() === day.unix() && this.endDate.unix;
      },
      isEndSelected(day) {
        return this.endDate.unix && this.endDate.unix() === day.unix();
      },
      isBetween(day) {
        return this.startDate.unix() < day.unix() && (this.endDate.unix && this.endDate.unix() > day.unix());
      },
      isSelected(day) {
        return this.startDate.unix() === day.unix() || (this.endDate.unix && this.endDate.unix() === day.unix());
      },
      isToday(day) {
        return moment(day).isSame(new Date(), "day");
      },
      isSaturday(day) {
        return moment(day).format('dddd') === 'Saturday';
      },
      isSunday(day) {
        return moment(day).format('dddd') === 'Sunday';
      },
      switchSelectedBookend(bookend){
        this.selectedBookend = bookend;
      },
      selectDate(newDate) {
        if (this.selectedBookend === this.CONSTANTS.START) {
          if (!this.isDisabled(newDate)) {
            this.classDirection = 'off';
            this.setClassDirection(newDate);
            this.startDate = newDate.clone();
            this.selectedBookend = this.CONSTANTS.END;
            if (this.endDate.unix && moment(newDate).isAfter(this.endDate, 'day')) {
                this.endDate = '';
            }
          }
        }
        else {
          if (moment(newDate).isBefore(this.startDate, 'day')) {
            this.startDate = newDate.clone();
          }
          else {
            this.endDate = newDate.clone();
          }
        }
      },
      selectYear(date) {
        this.setClassDirection(date);

        let newDate = moment([date.year(), this.startDate.month(), this.startDate.date()]);
        this.startDate = newDate.clone();

        this.setMonths();

        let scrollOffset = (this.startDate.year() - this.years[0].year()) * 40 - 130;
        $('.datepicker-years').animate({scrollTop: scrollOffset}, '100', () => {
          this.showOrHideYears();
        });

        this.$emit('change', {start: this.startDate, end: this.endDate});
      },
      setClassDirection(date) {
        this.dayDirection = 'direction-next';
        if (date.isBefore(this.startDate)) this.dayDirection = 'direction-prev';
      },
      setMonths() {
        let newMonths = [];
        let firstMonth = new month(this.startDate.month(), this.startDate.year());
        newMonths.push(firstMonth);

        if (this.doubled) {
          let mon = this.startDate.month() + 1;
          let year = this.startDate.year();

          if (mon > 11) {
            mon = 0;
            year += 1;
          }

          let secondMonth = new month(mon, year);
          newMonths.push(secondMonth);
        }

        this.months = newMonths;
      },
      nextMonth() {
        let tmpMonths = [];
        let monthsLength = this.months.length - 1;

        for (let i = 0; i < monthsLength; i++) {
          tmpMonths.push(new month(this.months[i + 1].month, this.months[i + 1].year));
        }

        let mon = this.months[monthsLength].month + 1;
        let year = this.months[monthsLength].year;

        if (mon > 11) {
          mon = 0;
          year += 1;
        }

        let tmpMonth = new month(mon, year);
        tmpMonths.push(tmpMonth);

        this.classDirection = 'direction-next';
        this.months = tmpMonths;
      },
      prevMonth() {
        let tmpMonths = [];
        let monthsLength = this.months.length - 1;

        for (var i = monthsLength; i > 0; i--) {
          tmpMonths.push(new month(this.months[i - 1].month, this.months[i - 1].year));
        }

        let mon = this.months[0].month - 1;
        let year = this.months[0].year;

        if (mon < 0) {
          mon = 11;
          year -= 1;
        }

        let tmpMonth = new month(mon, year);
        tmpMonths.unshift(tmpMonth);

        this.classDirection = 'direction-prev';
        this.months = tmpMonths;
      },
      submitDay() {
        this.classDirection = 'off';
        this.dayDirection = 'off';
        this.yearsVisible = false;
        this.$emit('change', {start: this.startDate, end: this.endDate});
        this.$emit('hide');
      },
      cancel() {
        this.classDirection = 'off';
        this.dayDirection = 'off';
        this.$emit('cancel');
      },
      showOrHideYears() {
        this.yearsVisible = !this.yearsVisible;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import '../assets/variables';
  @import '../assets/transitions';

  .datepicker {
    position: absolute;
    width: 315px;
    top: 100%;
    background-color: #ffffff;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    z-index: 2;

    &.double {
      width: 630px;

      &.landscape {
        width: 840px;
      }
    }

    &.landscape {
      width: 520px;
    }
  }

  .datepicker-header {
    background-color: $primary-color;
    color: #ffffff;
    padding: 20px;

    &.landscape {
      height: 373px;
      width: 165px;
      float: left;
    }

    .date-title {
      cursor: pointer;
      &.selected {
        font-size:14px;
        font-weight: bold;
      }
    }
  }

  .datepicker-body {
    .landscape {
      float: left;
    }
  }

  .datepicker-year {
    margin-bottom: 10px;
    line-height: 16px;
    position: relative;
    height: 16px;
    opacity: 0.7;
    overflow: hidden;
    cursor: pointer;
  }

  .datepicker-date {
    position: relative;
    font-size: 32px;
    line-height: 32px;
    height: 34px;
    overflow: hidden;

    &.landscape {
      line-height: 40px;
      height: 80px;
    }
  }

  .datepicker-week {
    font-size: 12px;
    line-height: 12px;
    color: rgba(0, 0, 0, 0.8);
    padding: 0 14px;
  }

  .datepicker-weekday {
    float: left;
    width: $day-size;
    text-align: center;
  }

  .datepicker-days {
    width: 287px;
    margin: 14px;
    margin-bottom: 0;
    height: $day-size * 6;
    position: relative;
    overflow: hidden;
    float: left;
    transition: height 300ms cubic-bezier(0.75, 0.02, 0.27, 0.99);
  }

  .datepicker-day {
    width: $day-size;
    height: $day-size;
    text-align: center;
    float: left;
    line-height: $day-size;
    cursor: pointer;
    position: relative;
    transition: color 450ms ease;

    &[disabled] {
      cursor: default;
      color: darken(#ffffff, 20%);

      .datepicker-day-effect {
        background-color: transparent;
      }

      .datepicker-day-text {
        color: darken(#ffffff, 20%);
      }
    }

    &:hover {
      color: #ffffff;
      .datepicker-day-effect {
        transform: scale(1);
        opacity: 0.6;
      }
    }
    &.between {
      color: #ffffff;
      .datepicker-day-effect {
        transform: scale(1);
        background-color: lighten($primary-color, 5%);
        border-radius: 0;
        width: 41px;
        opacity: 1;
      }
      &.saturday {
        .datepicker-day-effect {
          border-radius: 0 100% 100% 0;
          width: 37px;
        }
        &[data-day="1"] {
          .datepicker-day-effect {
            border-radius: 100%;
            width: 37px;
          }
        }
      }
      &[data-day="1"] {
        .datepicker-day-effect {
          border-radius: 100% 0 0 100%;
        }
      }
      &.sunday {
        .datepicker-day-effect {
          border-radius: 100% 0 0 100%;
        }
      }
      &:last-of-type {
        .datepicker-day-effect {
          border-radius: 0 100% 100% 0;
          width: 37px;
        }
      }
    }
    &.today {
      color: #ffffff;
      &.between {
        color: lighten($secondary-date-color, 5%);
        .datepicker-day-effect {
          background-color: lighten($primary-color, 5%);
        }
      }
      .datepicker-day-effect {
        transform: scale(1);
        background-color: lighten($secondary-date-color, 5%);
        opacity: 1;
      }
    }

    &.selected {
      color: #ffffff;
      &.today {
        color: lighten($secondary-date-color, 5%);
      }
      .datepicker-day-effect {
        transform: scale(1);
        background-color: lighten($primary-color, 5%);
        opacity: 1;
      }
    }

    &.start {
      .datepicker-day-effect {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        width: 41px;
      }
      &.saturday {
        .datepicker-day-effect {
          border-radius: 100%;
          width: 37px;
        }
      }
    }

    &.end {
      .datepicker-day-effect {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
      &.sunday {
        .datepicker-day-effect {
          border-radius: 100%;
        }
      }
      &[data-day="1"] {
        .datepicker-day-effect {
          border-radius: 100%;
          width: 37px;
        }
      }
    }
  }

  .datepicker-day-effect {
    position: absolute;
    width: $day-size - 4px;
    height: $day-size - 4px;
    border-radius: 50%;
    transform-origin: left center;
    background-color: lighten($primary-color, 5%);
    top: 2px;
    left: 2px;
    transform: scale(0);
    opacity: 0;
    transition: all 450ms ease;
  }

  .datepicker-day-text {
    position: relative;
  }

  .datepicker-controls {
    position: relative;
    z-index: 2;
    width: 315px;
    height: 56px;
    line-height: 56px;
    text-align: center;

    button {
      position: relative;
      background-color: transparent;
      border: none;
      user-select: none;
      outline: none;
      cursor: pointer
    }

    &.double {
      width: 630px;
    }

    &.landscape {
      float: left;
    }
  }

  .datepicker-next {
    width: 56px;
    height: 56px;
    line-height: 56px;
    float: right;
  }

  .datepicker-prev {
    width: 56px;
    height: 56px;
    line-height: 56px;
    float: left;

  }

  .datepicker-arrow {
    width: 11px;
    height: 11px;
  }

  .datepicker-month {
    width: 315px;
    position: relative;
    padding-top: 56px;
    margin-top: -56px;
    float: left;
    overflow: hidden;
  }

  .datepicker-month-label {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    width: 150px;
    margin-left: auto;
    margin-right: auto;
    line-height: 16px;
    height: 16px;
    text-align: center;
  }

  .datepicker-actions {
    text-align: right;
    padding: 8px;

    button {
      border: none;
      background-color: transparent;
      display: inline-block;
      cursor: pointer;
      outline: none;
      color: lighten($primary-color, 10%);
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      min-width: 88px;
      text-align: center;
      -webkit-appearance: none;
      line-height: 36px;
      transition: all 0.3s ease;
      &:hover {
        background-color: darken(#ffffff, 5%);
      }
    }
  }

  .datepicker-years {
    width: 315px;
    height: $day-size * 6 + 56 + 16;
    background-color: #ffffff;
    position: absolute;
    z-index: 2;
    margin-top: -56px;

    overflow: scroll;

    .datepicker-years-content {

      .datepicker-year {
        width: 100%;
        text-align: center;
        font-size: 25px;
        line-height: 25px;
        height: 25px;
        margin: 15px 0;

        transition: all 0.3s ease;

        &.selected, &:hover {
          font-size: 30px;
          height: 30px;
          font-weight: 300;
          color: $primary-color;
        }
      }
    }

    &.double {
      width: 630px;
    }

    &.landscape {
      margin-top: 0;
      margin-left: 205px;
    }
  }

</style>
