<template>
  <div class='item'
  :style='{
    transform: `translate(${moveX}px,${moveY}px) scale(${sx},${sy})`,
    opacity, width, height}'
  v-if='exist'>
    <img :src="src">
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>
  .item {
    position: fixed;
    transition: all .7s;
    z-index: 100;
    top: 0;
    left: 0;
    /* 因为有个运动变化的问题,本身是默认都50%的,所以我这里做个微调 */
    transform-origin: 5% 0%;
  }
  .item > img {
    width: 100%;
    border-radius: 50%;
  }
</style>
