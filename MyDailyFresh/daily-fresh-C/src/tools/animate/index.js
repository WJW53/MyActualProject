import Vue from 'vue';
import com from './index.vue';

const Animate = Vue.extend(com);//创建一个组件构造器,不是一个具体的组件实例噢
//最终还是得通过Vue.components注册才可以使用的

export default function createAnimate({
  startX, startY, endX, endY, src, width, height,
}) {
  const app = new Animate({
    el: document.createElement('div'),
    data() {
      return {
        moveX: startX,
        moveY: startY,
        sx: 1,
        sy: 1,
        opacity: 1,
        exist: true,
        src,
        width,
        height,
      };
    },
  });
  //变化一些css样式
  document.body.appendChild(app.$el);
  setTimeout(() => {
    app.moveX = endX;
    app.moveY = endY;
    app.sx = 0.1;
    app.sy = 0.1;
    app.opacity = 0;
  }, 0);
  setTimeout(() => {
    app.exist = false;//之后就销毁这个组件
  }, 1000);
}
