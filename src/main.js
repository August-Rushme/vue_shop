/*eslint-disable*/
import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import "./plugins/element.js"
//导入图标
import "./assets/iconfont/iconfont.css"
//导入全局样式表
import "./assets/css/global.css"
import axios from "axios"
//默认URL
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
Vue.config.productionTip = false
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
