import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from '@/config'
Vue.prototype.$config = config

// element 
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false


// 生产环境下使用fundebug
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.error = () => {}
  console.warn = () => {}
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
