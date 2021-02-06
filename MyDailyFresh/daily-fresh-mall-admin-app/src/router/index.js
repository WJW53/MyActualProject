import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/layout/Home.vue';
import Login from '../views/layout/components/Login.vue';
import store from '@/store';
import getMenuRoutes from '@/utils/permission';


Vue.use(VueRouter);

//商品的路由取决于用户的角色,先统一配置到这里来
const asyncRouterMap = [
  {
    path: '/product',
    name: 'Product',
    meta: {
      title: '商品',
    },
    component: Home,
    children: [
      {
        path: 'list',
        name: 'ProductList',
        meta: {
          title: '商品列表'
        },
        component: () => import("../views/page/ProductList"),
        children: [//只是为了测试更深的目录而已
          {
            path: 'whatever',
            name: 'Whatever',
            meta: {
              title: '随便吧'
            },
            component: () => import("../views/page/ProductAdd"),
          },
        ]
      },
      {
        path: 'add',
        name: 'ProductAdd',
        meta: {
          title: '添加商品'
        },
        component: () => import("../views/page/ProductAdd"),
      },
      {
        path: 'category',
        name: 'Category',
        meta: {
          title: '类目管理'
        },
        component: () => import("../views/page/Category"),
      }

    ]

  }
];


const routes = [
  // {//加上这个的话直接输入index,直接输入/index就不会自动跳转到index了,就需要/#/home/index了
  //   //除非再在/home下也配置重定向到index,我是这么干的
  //   path: '/',
  //   redirect: '/home',
  // },
  {
    path: '/',
    // path: '/home',
    name: 'Home',
    // redirect: '/home/index',
    component: Home,
    meta: {
      title: "首页"
    },
    children: [
      {
        path: 'index',
        name: "Index",
        meta:{
          title:'统计',
        },
        component: () => import("../views/page/Index.vue"),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta:{
      title:'登录'
    },
    component: Login
  },
];

const router = new VueRouter({
  routes,
});


let isAddRoutes = false;
router.beforeEach(function (to, from, next) {
  //登陆状态校验
  if (to.path !== '/login') {
    //如果cookie存在的话,可以直接跳转
    if (store.state.user.appkey && store.state.user.username && store.state.user.role && store.state.user.email) {
      if (!isAddRoutes) {//避免总在重复添加
        //控制当前用户可以有哪些路由权限,比如商品那里,他能看到哪些按钮页面
        const menuRoutes = getMenuRoutes(store.state.user.role, asyncRouterMap);
        // console.log(menuRoutes);
        router.addRoutes([...menuRoutes]);//动态添加更多的路由规则,参数必须是一个符合 routes 选项要求的数组
        //修改状态数据
        store.dispatch('changeMenuRoutes',routes.concat(menuRoutes));
        isAddRoutes = !isAddRoutes;
      }

      return next();
    } else {//否则就要去登录界面
      return next('/login');
    }
  }
  return next();//
});


export default router;
