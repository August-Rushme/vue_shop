/*eslint-disable*/
import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//通过加载组件的方式引入,局部插件引入会有bug，或者直接只要import { Message } from 'element-ui';就好了，不需要使用Vue.use(Message)
// Vue.component(Message.name, Message)
Vue.prototype.$message = Message
