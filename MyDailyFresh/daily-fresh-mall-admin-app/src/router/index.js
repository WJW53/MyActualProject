import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import getMenuRoutes from '@/utils/permission';
import Home from '../views/layout/Home.vue';
import Login from '../views/layout/components/Login.vue';


Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;//解决一类错误
//Redirected when going from "/login" to "/index" via a navigation guard.
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
}


//商品的路由取决于用户的角色,先统一配置到这里来
const asyncRouterMap = [
  {
    path: '/product',
    name: 'Product',
    redirect: '/product/list',
    meta: {
      title: '商品',
      icon: 'inbox',
      hidden: false,
    },
    component: Home,
    children: [
      {
        path: 'list',
        name: 'ProductList',
        meta: {
          title: '商品列表',
          icon: 'unordered-list',
          hidden: false,
        },
        component: () => import("../views/page/ProductList"),
        // children: [//只是为了测试更深的目录而已
        //   {
        //     path: 'whatever',
        //     name: 'Whatever',
        //     meta: {
        //       title: '随便吧',
        //       hidden: false,
        //     },
        //     component: () => import("../views/page/ProductAdd"),
        //   },
        // ]
      },
      {
        path: 'add',
        name: 'ProductAdd',
        meta: {
          title: '添加商品',
          icon: 'file-add',
          hidden: false,
        },
        component: () => import("../views/page/ProductAdd"),
      },
      {
        path: 'edit/:id',//为了确定当前要编辑哪个产品的id
        name: 'ProductEdit',
        meta: {
          title: '编辑商品',
          icon: 'file-add',
          hidden: true,
        },
        component: () => import("../views/page/ProductAdd.vue"),
      },
      {
        path: 'category',
        name: 'Category',
        meta: {
          title: '类目管理',
          icon: 'project',
          hidden: false,
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
    component: Home,
    redirect: '/index',
    meta: {
      title: "首页",
      icon: 'home',
      hidden: false,
    },
    children: [
      {
        path: 'index',
        name: "Index",
        meta: {
          title: '统计',
          icon: 'number',
          hidden: false,
        },
        component: () => import("../views/page/Index.vue"),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      hidden: true,
    },
    component: Login
  },
];

const router = new VueRouter({
  routes,
});

let isAddRoutes = false;
router.beforeEach((to, from, next) => {
  // console.log(to, from);
  //登陆状态校验
  if (to.path !== '/login') {
    //如果cookie存在的话,可以直接跳转
    if (store.state.user.appkey && store.state.user.username
      && store.state.user.role && store.state.user.email) {
      if (!isAddRoutes) {//避免总在重复添加
        //控制当前用户可以有哪些路由权限,比如商品那里,他能看到哪些按钮页面
        const menuRoutes = getMenuRoutes(store.state.user.role, asyncRouterMap);
        //注意：dispatch都是异步的,但是我们必须等他们执行完才能next();
        //修改状态数据
        // console.log(routes,menuRoutes);
        store.dispatch('changeMenuRoutes', routes.concat(menuRoutes)).then(() => {
          // console.log('addRoutes');
          router.addRoutes(menuRoutes);//动态添加更多的路由规则,参数必须是一个符合 routes 选项要求的数组
          next({ name: to.name });//没辙了,不知道为啥那个样子(要点两次),我只能采取这种办法了,这样也能保证
          //刷新时,还停留在原先的页面
        });
        isAddRoutes = true;//
      }
      return next();//这里不能写else,因为每次刷新这个index都会重置
      //导致isAddRoutes每次都初始化为false,这儿要写了else,那每次刷新就不会来这
    }
    else {//否则就要去登录界面
      return next('/login');
    }
  } else {
    return next();//
  }
});


export default router;