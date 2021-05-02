import Vue from "vue"
import VueRouter from "vue-router"
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/home", component: Home }
]

const router = new VueRouter({
  routes
})
//拦截路由导航守卫
//to:将要跳转到的路由，
//from，从哪个路径跳转而来
//next，放行函数
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next()
  const tokenStr = window.sessionStorage.getItem("token")
  if (!tokenStr) return next("/login")
  next()
})
export default router
