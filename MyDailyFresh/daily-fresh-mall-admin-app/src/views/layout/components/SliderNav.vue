<template>
  <div class="main-header">
    <a-button
      type="primary"
      style="margin-bottom: 16px"
      @click="toggleCollapsed"
    >
      <a-icon :type="$store.state.collapsed ? 'menu-unfold' : 'menu-fold'" />
    </a-button>

    <div class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>
          {{ $route.matched[0].meta.title }}
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="{ name: $route.name }">
            {{ $route.meta.title }}
          </router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <ul class="user-info">
      <li>{{ $store.state.user.username }} <a-icon type="down" /></li>
      <li @click="handleLogout">退出</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // curRouteMatched: this.$route.matched,
    };
  },
  watch: {
    $route() {//本来是想在这里将data中的属性curRouteMatched更新,然后使得模板中的数据更新的
    //但是后来发现我那么写好像用不到这样
    //   console.log("监听到变化了");
    //   console.log(this.$route);
    //  this.curRouteMatched = this.$route.matched;
    },
  },
  methods: {
    toggleCollapsed() {
      this.$store.dispatch("changeCollapsed");
    },
    handleLogout() {
      this.$store.dispatch("logout");
      this.$router.push({
        name: "Login",
      }); //退出后默认回到login页面
    },
  },
  mounted() {},
};
</script>