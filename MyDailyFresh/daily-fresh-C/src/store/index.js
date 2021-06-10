import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sideList: [],
    goodsList: [],
    goodsTotal: 0,
    goodsType: '',
    counterMap: {},//id:num, 有num个商品(id)
    size: 7,
    sortType: 'all',
    over: false,//是否到了最后一个二级导航了,为了做上拉查看下一分类而用上
  },
  mutations: {
    changeOver(state, bool) {
      state.over = bool;
    },
    sortGoodsList(state, type) {
      state.sortType = type;
    },
    setCounterMap(state, map) {
      state.counterMap = map;
    },
    setSideList(state, list) {
      state.sideList = list;
    },
    setGoodsList(state, obj) {
      state.goodsList = [...state.goodsList, ...obj.list];//这是因为滚动加载,要重新push合并
      state.goodsTotal = obj.total;
    },
    resetGoodsList(state) {
      state.goodsList = [];
    },
    setGoodsType(state, type) {
      state.goodsType = type;
    },
    resetList(state) {
      state.goodsList = [];
    },
    //修改本地化存储的一些值,delAll就是全选状态下的删除
    storageChange(state, { id, value, delAll=false }) {
      if (state.counterMap[id]) {
        if ((state.counterMap[id] === 1 && value === -1) || delAll===true) {
          Vue.delete(state.counterMap, id);
        } else {
          Vue.set(state.counterMap, id, state.counterMap[id] + value);
          // if(state.counterMap[id] < 1){
          //   Vue.delete(state.counterMap, id);
          // }
        }
      } else {
        Vue.set(state.counterMap, id, 1);
      }
      localStorage.setItem('goods', JSON.stringify(state.counterMap));
      // if (state.counterMap[id]) {
      //   Vue.set(state.counterMap, id, state.counterMap[id] + value);
      // } else {
      //   Vue.set(state.counterMap, id, 1);
      // }
      // localStorage.setItem('goods', JSON.stringify(state.counterMap));
    },
  },
  actions: {
    getSideList({ commit, dispatch }, type) {
      return api.getSideList(type).then((data) => {
        commit('setSideList', data.data);
        commit('setGoodsType', data.data[0]);
        // commit('sortGoodsList', 'all');
        dispatch('getGoodsList', { type: data.data[0], page: 1 });
      });
    },
    getGoodsList({ commit, state }, options) {
      const type = options.type || state.goodsType;
      const { page } = options;
      return api.getGoodsList(type, page, state.size, state.sortType).then((data) => {
        commit('setGoodsList', data.data);
        commit('setGoodsType', type);
      });
    },
  },
  modules: {
  },
});
