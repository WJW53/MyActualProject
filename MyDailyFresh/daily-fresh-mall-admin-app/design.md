# 关于一些页面的设计原则、理念、要求

## 登录/注册页面

放在一个单独的路由中login.vue

**登陆后应该把一些信息放到本地缓存中，比如cookie，否则一刷新很多数据就又初始化了**

```npm install js-cookie```