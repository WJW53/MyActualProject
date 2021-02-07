<template>
  <div class="menu-list">
    <!-- {{ $router.currentRoute.matched[1]? $router.currentRoute.matched[1].name : '' }}
    {{ $route.matched[0].name }} -->
    <a-menu
      :default-selected-keys="[$route.matched[1] ? $route.matched[1].name : '']"
      :default-open-keys="[$route.matched[0].name]"
      mode="inline"
      theme="dark"
      :inline-collapsed="$store.state.collapsed"
    >
      <template v-for="route in $store.state.menuRoutes">
        <a-sub-menu v-if="!route.meta.hidden" :key="route.name">
          <span slot="title">
            <a-icon :type="route.meta.icon" />
            <span>{{ route.meta.title }}</span>
          </span>
          <a-menu-item v-for="child in route.children" :key="child.name">
            <!-- 记得这儿写router-link噢,不然导航栏路由不会变 -->
            <router-link :to="{ name: child.name }">
              <a-icon :type="child.meta.icon" />
              {{ child.meta.title }}
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // console.log(this.$route);
    // console.log(this.$router);
  },
};
</script>