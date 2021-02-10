<template>
  <div class="search-box">
    <a-form-model
      layout="inline"
      :model="searchForm"
      @submit="handleSubmit"
      @submit.native.prevent
    >
      <a-form-model-item label="搜索关键字">
        <a-input v-model="searchForm.searchWord" placeholder="请输入关键字">
          <!-- <a-icon
          slot="prefix"
          type="searchWord"
          style="color: rgba(0, 0, 0, 0.25)"
        /> -->
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="商品类目">
        <a-select
          show-search
          placeholder="请选择商品类目"
          style="width: 200px"
          @change="handleChange"
          allowClear
        >
          <template v-if="categoryList && categoryList.length">
            <a-select-option
              v-for="c in categoryList"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name }}
            </a-select-option>
          </template>
        </a-select>
      </a-form-model-item>
      <a-form-model-item>
        <a-button
          type="primary"
          html-type="submit"
        >
          <!-- :disabled="searchForm.searchWord === '' || searchForm.catagory === ''" -->
          搜索
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchForm: {
        searchWord: "",
        category: "",
      },
    };
  },
  props:['categoryList'],
  created() {
  },
  methods: {
    //提交表单时触发的函数
    handleSubmit(e) {
      //   console.log(this.searchForm);
      this.$emit("submit", this.searchForm);
    },
    //切换类目时触发的函数
    handleChange(value) {
      // console.log(`selected ${value}`);
      this.searchForm.category = value;
    },
  },
};
</script>

<style lang="less">
.search-box {
  padding: 10px;
}
</style>
