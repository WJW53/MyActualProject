# 关于一些页面的设计原则、理念、要求

> **初始化的时候，只挂载不需要权限路由，如登陆，注册等页面路由，然后等用户登录之后，后端返回当前用户的权限表，前端根据这个权限表遍历前端路由表，动态生成用户权限路由，然后使用vue-router提供的addRoutes,将权限路由表动态添加到路由实例中**

统一配置axios,拦截请求,过滤、判断

## 登录/注册页面

放在一个单独的路由中login.vue

**登陆后应该把一些信息放到本地缓存中，比如cookie，否则一刷新很多数据就又初始化了**

```npm install js-cookie```

### 登录状态校验

将后台返回的信息存入cookie，然后利用导航守卫拦截路由跳转，跳转前判断下cookie是否存在，存在就不用再登录
否则返回登录页面登录

### 不同角色登录权限判断

配置每个路由的meta字段

新建一个路由表，统一存放着所有角色的路由信息，然后再和用户角色校验，过滤掉没有权限的路由

然后依靠router.addRoutes和store.dispatch

### 注意：坑点

- 1. router.addRoutes和store.dispatch都是异步的,但是我们必须等他们执行完才能next();
而dispatch返回的是Promise所以可以在then方法里执行next();

- 2. 避免重复添加路由而导致报错的两种三种方案
    1. 刷新页面，则vue、router和store也会重新初始化，但扯淡呢，这也太不优雅了
    2. 我写的是配置一个锁
    3. 经过一番搜索，终于找到了一种方法，即重置当前router的match属性：
```js    
router.js
 
// 定义一个函数来创建router
export const createRouter = routes => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
 
// 在使用addRoutes的地方
// 重置当前router的match = 初始router.match
router.match = createRouter(constantRoutes).match;
router.addRoutes(routes);
```
这样就可以完美解决问题了。

    4. 总结：
整个解决的过程还是比较痛苦的，因为实际中我的代码是比较复杂的，并不像上面简化后那么简单。整个addRoutes是在store.dispatch中完成，并且中间还夹杂着生成动态路由，根据动态路由再生成用户菜单等一系列功能，干扰比较大，并且这个是源码报警，不好定位，只能通过console和浏览器调试，一步步缩小报错范围，最终找到问题原因。然后再通过google，`以及搜索vue-router仓库的issue一步步找到解决方法`。**所以想说，如果大家开发中遇到一些第三方依赖的问题，可以去搜索官方仓库的issue，很好用的，很多问题其实issue中都有答案。我是屡试不爽。最后，一定要用google，垃圾百度，浪费我好长时间，啥都没找到**

- 3. 动态添加导航栏时，addRoutes不生效解决的两种方案
    1、在addroutes前，使用router.options.routes=XXXXX的方法手动添加
    2、我用的是，在store的state里里维护一个routes数组，然后使用这个数组遍历生成侧面导航栏


## 引入v-charts

做统计页面的图表

坑 echarts也要降级才能运行,最新的是5.xx,
vue3.0才是适配了v-echart5.0+
vue2.x要用echarts4.xxx

```js
"echarts": "^4.0.2",
"v-charts": "^1.19.0",
```

