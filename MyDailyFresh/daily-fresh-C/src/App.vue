<template>
  <div id="app">
    <transition :name="transitionName" :mode="$router.back ? 'out-in' : 'in-out'">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'app',
  created() {
    //因为有本地化存储的,所以这里才这样干
    const counterMap = JSON.parse(localStorage.getItem('goods')) || {};
    this.$store.commit('setCounterMap', counterMap);
  },
  data() {
    return {
      transitionName: 'slide-left',
    };
  },
  watch: {
    //得监听路由的变化才能配合做动画效果,这里只需对从search跳到classify时做处理即可
    $route(to, from) {
      if (to.name === 'classify' && from.name === 'search') {
        this.$router.back = true;
      }
      if (this.$router.back) {
        this.transitionName = 'slide-right';//退出search路由时就out-in,translateX:100%
      } else {
        this.transitionName = 'slide-left';
      }
      this.$router.back = false;//为了下次的操作
    },
  },
};
</script>

<style>
.view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  transition: all .3s linear;
}
.slide-left-enter {
  transform: translate(100%, 0);
}

.slide-right-leave-to {
  transform: translate(100%, 0);
}

/* .slide-left-leave-active {
  transform: translate(-100%, 0);
} */
</style>
