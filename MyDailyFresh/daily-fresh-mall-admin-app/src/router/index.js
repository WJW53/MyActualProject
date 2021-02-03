import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/layout/Home.vue';
import Login from '../views/layout/components/Login.vue';
import store from '@/store';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [

    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(function (to, from, next) {
  //登陆状态校验
  if (to.path !== '/login') {
    //如果cookie存在的话,可以直接跳转
    if (store.state.user.appkey && store.state.user.username && store.state.user.role && store.state.user.email) {
      next();
    } else {//否则就要去登录界面
      next('/login');
    }
  }
  next();//
});


export default router;
