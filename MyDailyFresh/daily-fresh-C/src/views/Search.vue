<template>
  <div class="search-wrapper">
    <div class="search-head">
      <!-- 返回前一个路由记录 -->
      <van-icon name="arrow-left" class="arr-left" @click="$router.goBack()"></van-icon>
      <van-search
        class="search-content"
        v-model="value"
        show-action
        :placeholder="place"
        @search="onSearch"
        @input="input"
        @focus="focus"
        autofocus
      >
        <template #action v-if="showList">
          <div @click="onSearch(value)">搜索</div>
        </template>
        <!-- 否则展示购物车的link -->
         <template #action v-else>
          <router-link tag="div" class="shop-car" id="shop-car" to="/home/shopping">
            <van-icon name="shopping-cart-o" :badge="badge"/>
          </router-link>
        </template>
      </van-search>
    </div>
    <!-- 可视化模糊搜索的提示词并且高亮显示关键字 -->
    <div class="like-search" v-if="likeList.length && showList">
      <van-list>
        <van-cell v-for="item in likeList" :key="item" :title="item" @click="onSearch(item)" >
          <template #title>
            <span class="custom-title" v-html="formatHTML(item)"></span>
          </template>
        </van-cell>
      </van-list>
    </div>
    <div class="goods-card" v-if="!showList">
      <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
      <Card v-for="(item, i) in list" :key="i"
        :id="item.id"
        :title="item.title"
        :desc="item.desc"
        :priceOff="item.priceOff"
        :price="item.price"
        :thumb="item.images[0]"
        :num="counterMap[item.id]"
        :tags="item.tags"
        @changeHandler="addCounter"></Card>
    </van-list>
    </div>
    <div class="history" v-if="likeList.length <= 0 && showList">
       <History :searchList="searchList" @search="onSearch"></History>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Card from '../components/card.vue';
import History from '../components/history.vue';

export default {
  components: {
    Card,
    History,
  },
  data() {
    return {
      timer: null,
      searchList: [],//搜索关键词的历史记录
      loading: false,//此次加载状态结束,因为这次请求完成了
      finished: false,//没有更多数据了
      value: '',
      length: 0,
      place: '芒果10块2斤',
      likeList: [],//模糊搜索的匹配字段,我们给它提示出来
      showList: true,//历史记录是否显示
      list: [],
      page: 1,
      size: 7,
    };
  },
  created() {
    this.searchList = JSON.parse(localStorage.getItem('searchList')) || [];
  },
  methods: {
    ...mapMutations(['storageChange']),
    addCounter(id, value) {
      this.storageChange({ id, value });
    },
    //搜索后的操作..
    onSearch(val) {
      if (val) {
        this.value = val;
      }
      this.finished = false;
      this.likeList = [];
      if (this.value === '') {
        this.value = this.place;
      }
      const result = this.searchList.find((item) => item.value === this.value);
      if (result) {//如果之前搜索过,就更新时间戳,就是优先排序
        result.time = new Date().getTime();
        this.searchList.sort((a, b) => b.time - a.time);
      } else {
        //每次都将最新的搜索加入记录表中,最多10个记录
        this.searchList.unshift({ value: this.value, time: new Date().getTime() });
        if (this.searchList.length >= 11) {
          this.searchList.pop();
        }
      }
      localStorage.setItem('searchList', JSON.stringify(this.searchList));//记得存储起来
      this.list = [];
      this.page = 1;//然后就请求数据呗
      this.$api.Search(this.value, this.page, this.size).then((data) => {
        this.length = data.data.total;
        this.list = [...this.list, ...data.data.list];
        this.showList = false;
      });
    },
    //加载搜索结果
    onLoad() {
      this.page += 1;
      this.$api.Search(this.value, this.page, this.size).then((data) => {
        this.length = data.data.total;
        this.list = [...this.list, ...data.data.list];
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= this.length) {
          this.finished = true;
        }
      });
    },
    //对输入框的处理
    input() {
      if (this.value === '') {
        this.likeList = [];
        clearInterval(this.timer);//必须清空,不然请求会有两次
        this.timer = null;
        return;
      }
      //做个防抖功能,节省请求次数
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      } else {
        this.timer = setTimeout(() => {
          this.$api.likeSearch(this.value).then((data) => {
            this.likeList = data.data.result;
            clearInterval(this.timer);
            this.timer = null;
          });
        }, 300);
      }
    },
    //高亮显示搜索关键字
    formatHTML(value) {
      const reg = new RegExp(this.value, 'g');
      return value.replace(reg, this.value.fontcolor('red'));//这个fontcolor是原生的方法,控制台里玩玩就懂了
    },
    //再次回到搜索框的话,就显示历史记录界面而不再显示商品列表
    focus() {
      this.showList = true;
    },
  },
  computed: {
    ...mapState({
      counterMap: (state) => state.counterMap,
    }),
    badge() {
      const l = Object.values(this.counterMap).reduce((prev, next) => prev + next, 0);
      if (l > 99) {
        return '99+';
      }
      return l;
    },
  },
};
</script>

<style lang="less">
.search-wrapper {
  width: 100%;
  height: 100vh;
  z-index: 10;
  background: #fff;
  .search-head {
    width: 345px;
    background: #fff;
    margin: 0 auto;
    display: flex;
    align-items: center;
    position: fixed;
    left: 15px;
    top: 0;
    z-index: 100;
    .arr-left {
      font-size: 22px;
    }
    .search-content {
      flex: 1;
      .shop-car {
        font-size: 25px;
      }
    }
  }
  .like-search {
    top: 50px;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding-left: 32px;
    background: #fff;
    z-index: 10;
  }
  .goods-card {
    position: relative;
    width: 345px;
    margin: 48px auto 0;
    z-index: 10;
    background: #fff;
  }
  .history {
    width: 350px;
    position: absolute;
    top: 35px;
    left: 10px;
    z-index: 1;
  }
}

</style>
