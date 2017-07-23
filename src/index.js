import Vue from 'vue';
import './main.scss';
import App from './components/App.vue';

window.app = new Vue({
  el: '#app',
  render: h => h(App)
});
