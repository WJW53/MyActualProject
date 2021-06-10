<template>
<!-- 手离开屏幕,点击到屏幕上,在屏幕上滚动 -->
  <div class="tab-wrapper" ref="scroll"
  @touchend="scrollTo"
  @touchstart="move = false"
  @touchmove="move = true">
   <div class="tab-item"
   v-for="(item, i) in menuList"
   :key="item.title"
   :class="{'active': i == index}"
   :data-id="i">
     <div class="img-box">
       <img :src="item.imgURL">
     </div>
     <div class="title-box">{{item.title}}</div>
   </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
      move: false,//是否正在移动
      menuList: [
        {
          title: '时令水果',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/时令水果.jpg',
        },
        {
          title: '酒水冲调',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/酒水冲调.jpg',
        },
        {
          title: '安心乳品',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/安心乳品.jpg',
        },
        {
          title: '休闲零食',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/休闲零食.jpg',
        },
        {
          title: '肉蛋食材',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/肉蛋食材.jpg',
        },
        {
          title: '新鲜蔬菜',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/新鲜食材.jpg',
        },
        {
          title: '熟食餐饮',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/熟食餐饮.jpg',
        },
        {
          title: '海鲜水产',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/海鲜水产.jpg',
        },
        {
          title: '粮油调味',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/粮油调味.jpg',
        },
        {
          title: '某手美食',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/某手美食.jpg',
        },
        {
          title: '纸杯清洁',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/纸品清洁.jpg',
        },
        {
          title: '个人护理',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/个人护理.jpg',
        },
        {
          title: '美妆护肤',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/美妆护肤.jpg',
        },
        {
          title: '家居收纳',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/家居收纳.jpg',
        },
        {
          title: '家用电器',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/家用电器.jpg',
        },
        {
          title: '3C数码',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/3C数码.jpg',
        },
        {
          title: '母婴用品',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/母婴用品.jpg',
        },
        {
          title: '鲜花绿植',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/鲜花绿植.jpg',
        },
        {
          title: '宠物用品',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/宠物用品.jpg',
        },
        {
          title: '图书玩具',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/图书文具.jpg',
        },
        {
          title: '手表配饰',
          imgURL: 'https://duyi-bucket.oss-cn-beijing.aliyuncs.com/img/手表配饰.jpg',
        },
      ],
    };
  },
  methods: {
    scrollTo(e) {
      if (this.move) return;
      this.$store.commit('resetGoodsList');
      if (e.target.dataset.id) {//获取索引位置,以及做个适配
        this.index = e.target.dataset.id;
      } else if (e.target.parentElement.dataset.id) {
        this.index = e.target.parentElement.dataset.id;
      } else {
        this.index = e.target.parentElement.parentElement.dataset.id;
      }
      this.$emit('handlerChange', this.menuList[this.index].title);//同时更新侧边栏数据
      //为了让点击之后的item处于导航栏中心而做的运动计算
      //下面是计算尺寸精髓,要画图自己琢磨的
      //getBoundingClientRect()返回元素的大小及其相对于视口的位置
      //当当前item在中心右边时：
      //disX = s.offsetWidth/2 + s.getBoundingClientRect().left - p.offsetWidth/2
      //滚动条的距离应该是:父级元素的滚动条 + disX
      //相反情况时最后的公式发现,取负即可,所以我们最终取绝对值配合方向即可
      const itemOL = e.target.getBoundingClientRect().left;
      const itemOW = e.target.offsetWidth;
      const wrapperWidth = this.$refs.scroll.clientWidth;
      const changeDisX = itemOL - wrapperWidth / 2 + itemOW / 2;
      this.moveScroll(this.$refs.scroll.scrollLeft, changeDisX);
    },
    moveScroll(start, end) {
      let dis = 0;
      let speed = 5;
      if (end < 0) {//左边item变到中间
        speed *= -1;
      }
      const t = setInterval(() => {
        dis += speed;
        this.$refs.scroll.scrollLeft = start + dis;
        if (Math.abs(dis) >= Math.abs(end)) {//超过了就不要再动了
          this.$refs.scroll.scrollLeft = start + end;//所以这里是直接赋值
          clearInterval(t);
        }
      }, 2);
    },
  },
};
</script>

<style lang="less" scoped>
  .tab-wrapper {
    display: flex;
    height: 104px;
    overflow-x: auto;//超出部分滚动,scroll也行
    overflow-y: visible;
    .tab-item {
      flex-shrink: 0;
      width: 50px;
      padding: 10px 5px;
      text-align: center;
      .img-box {
        width: 100%;
        height: 50px;
        border-width: 2px;
        border-style: solid;
        border-color: transparent;
        border-radius: 23px;
        img {
          width: 45px;
          height: 45px;
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
        }
      }
      .title-box {
        margin-top: 5px;
        font-size: 12px;
      }
    }
    .active {//激活状态
      .img-box {
        background: #fff;
        border-color: #d13193;
      }
      .title-box {
        color: #fff;
        background: #d13193;
        font-weight: bold;
        border-radius: 30px;
      }
    }
  }
  .tab-wrapper::-webkit-scrollbar{//隐藏滚动条
    width: 0px;
    background: none;
  }
</style>
