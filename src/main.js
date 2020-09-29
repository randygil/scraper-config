import Vue from 'vue'
import App from './App.vue'
import '../plugins/boostrap-vue'


import VCalendar from 'v-calendar';
import 'v-calendar/lib/v-calendar.min.css';
import VueNoty from 'vuejs-noty'

Vue.use(VueNoty)
import 'vuejs-noty/dist/vuejs-noty.css'

// Use v-calendar, v-date-picker & v-popover components
Vue.use(VCalendar, {
  firstDayOfWeek: 2  // Monday
               // ...other defaults
});
import axios from "axios"
const baseURL =
  process.env.NODE_ENV === "development" ? "http://localhost:3333/api" : "/api";
axios.defaults.baseURL = baseURL

 // This works fine
 const body = document.querySelector('body');
 let vueContainer = document.createElement('div')
 body.appendChild(vueContainer);
  const app = new Vue({
    render: h => h(App)
  })
  app.$mount(vueContainer);
