import Vue from 'vue';
import Vuex from 'vuex';
import { getUserCookie, setCookie, removeUserCookie } from '@/utils/userCookie'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //用于切换菜单的闭合状态,false代表不闭合
    collapsed: false,
    //用户信息
    // user: {
    //   username: '',
    //   email: '',
    //   appkey: '',
    //   role: '',
    // }
    user: getUserCookie(),
    menuRoutes: [],//存储菜单的路由
  },
  mutations: {
    changeCollapsed(state) {
      state.collapsed = !state.collapsed;
    },
    setUserInfo(state, userInfo) {
      state.user = userInfo;
    },
    //退出之后就清空user信息
    logout(state) {
      state.user = {
        username: '',
        email: '',
        appkey: '',
        role: '',
      }
    },
    changeMenuRoutes(state, routes) {
      state.menuRoutes = routes;
    }
  },
  actions: {
    changeCollapsed({ commit }) {
      commit('changeCollapsed');
    },
    setUserInfo({ commit }, userInfo) {
      commit('setUserInfo', userInfo);
      setCookie(userInfo);
    },
    logout({ commit }) {
      // console.log('logout');
      commit('logout');
      removeUserCookie();
    },
    changeMenuRoutes({ commit }, routes) {
      commit('changeMenuRoutes', routes);
    }
  },
  modules: {
  },
});
