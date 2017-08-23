<style lang="scss" scoped>
  @import '../assets/variables.scss';
  .datepicker-container {
    position: relative;
    .date-formatted{
      color: $brand-accent;
      cursor: pointer;
    }
  }
</style>

<template>
  <div class="datepicker-container">

    <h2 class="date-formatted"
        @click="showDatepicker">
      {{date_formatted || 'Select Date'}}
    </h2>

    <input type="hidden"
           :id="id"
           :name="name"
           :value="date_raw">

    <datepicker-agenda :disable-passed-days="disablePassedDays"
                       :doubled="doubled"
                       :disabled-days="disabledDays"
                       :lang="lang"
                       :orientation="orientation"
                       :show="isVisible"
                       @change="selectDate"
                       @hide="hideDatePicker"
                       @cancel="cancelDateSelection">
    </datepicker-agenda>
  </div>
</template>

<script>
  import moment from 'moment';

  import DatepickerAgenda from 'components/DatepickerAgenda';

  export default {
    name:'datepicker',
    components: {
      DatepickerAgenda
    },
    props: {
      classDesign: { type: String, default: '' },
      disablePassedDays: { type: Boolean, default: false },
      disabledDays: { type: Array, default() { return [] } },
      doubled: { type: Boolean, default: false },
      format: { type: String, default: 'YYYY-MM-DD' },
      id: { type: String, default: 'vue-datepicker' },
      lang: { type: String, default: 'en' },
      name: { type: String, default: 'datepicker' },
      orientation: { type: String, default: 'portrait' }
    },
    data() {
      return {
        startDate: '',
        endDate: '',
        isVisible: false
      };
    },
    computed: {
      date_formatted() {
        if (this.startDate && this.endDate) return `${this.startDate.format(this.format)} - ${this.endDate.format(this.format)}`;
        return '';
      },
      date_raw() {
        if (this.startDate && this.endDate) return `${this.startDate.format('YYYY-MM-DD')} - ${this.endDate.format('YYYY-MM-DD')}`;
        return '';
      }
    },
    mounted() {
      moment.locale(this.lang);
    },
    methods: {
      selectDate(newDates) {
        this.startDate = newDates.start;
        this.endDate = newDates.end;
        this.$emit('dateChanged',newDates);
      },
      showDatepicker() {
        this.isVisible = true;
        setTimeout( () => document.addEventListener('click', this.hideDatePicker), 0);
      },
      hideDatePicker() {
        this.isVisible = false;
        document.removeEventListener('click', this.hideDatePicker);
      },
      cancelDateSelection() {
        this.hideDatePicker();
      }
    }
  };
</script>
