import Vue from 'vue'
import App from './App.vue'
import '../plugins/boostrap-vue'


import VCalendar from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';

// Use v-calendar, v-date-picker & v-popover components
Vue.use(VCalendar, {
  firstDayOfWeek: 2  // Monday
               // ...other defaults
});
new Vue({
  el: '#app',
  render: h => h(App)
})
