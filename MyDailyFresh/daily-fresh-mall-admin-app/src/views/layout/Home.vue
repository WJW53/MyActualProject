<template>
  <div class="home">
    <left-menu></left-menu>
    <div :class="{ 'main-app': true, 'menu-fold': $store.state.collapsed }">
      <slider-nav></slider-nav>
      <!-- 根据路由动态展示主要内容区的数据 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LeftMenu from "./components/Menu";
import SliderNav from "./components/SliderNav";
export default {
  components: {
    LeftMenu,
    SliderNav,
  },
  data() {
    return {

    };
  },
  methods: {},
};

</script>

<style lang="less">
// 这里用less写法即可,千万不要加上scoped
@import url("~@/assets/css/home.less");
</style>