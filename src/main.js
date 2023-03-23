import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import * as echarts from 'echarts'

import BaseContainer from '@/components/BaseContainer'
import Pagination from '@/components/Pagination'

Vue.component('BaseContainer', BaseContainer)
Vue.component('Pagination', Pagination)

Vue.prototype.$echarts = echarts

ElementUI.Dialog.props.closeOnClickModal.default = false // 全局关闭点遮罩关闭弹框
Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
