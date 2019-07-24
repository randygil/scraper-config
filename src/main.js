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


 // This works fine
 const body = document.querySelector('body');
 let vueContainer = document.createElement('div')
 body.appendChild(vueContainer);
  const app = new Vue({
    render: h => h(App)
  })
  app.$mount(vueContainer);
