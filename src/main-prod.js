import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入字体图标
import './assets/iconfont/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
//导入富文本
import VueQuillEditor from 'vue-quill-editor'

//导入进度条
import NProgress from 'nprogress'

// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//配置请求拦截器
//在request拦截器中，展示进度条NPprogress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  //为请求头对象，添加Token验证的Authorization字段(除了登录其他请求都需要token认证)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//在response拦截器中，隐藏进度条NPprogress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.use(VueQuillEditor)
//时间过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
