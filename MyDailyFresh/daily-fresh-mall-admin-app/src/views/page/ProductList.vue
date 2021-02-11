<template>
  <div class="product-list">
    <!-- 搜索 -->
    <search-box
      @submit="searchSubmit"
      :categoryList="categoryList"
    ></search-box>
    <a-button class="product-add-btn">
      <router-link :to="{ name: 'ProductAdd' }">添加商品</router-link>
    </a-button>
    <!-- 表格 -->
    <product-table
      :tableData="tableData"
      :page="page"
      @change="changePage"
      @edit="editProduct"
      @remove="removeProduct"
    ></product-table>
  </div>
</template>

<script>
import SearchBox from "@/components/Search.vue";
import ProductTable from "@/components/ProductTable.vue";
import api from "@/api/product.js";
import categoryApi from "@/api/category.js";
import productApi from "@/api/product";

export default {
  data() {
    return {
      tableData: [],
      searchForm: {},
      page: {
        current: 1,
        pageSize: 10,
        total: 1,
        showSizeChanger: true,
      },
      categoryList: [],
      categoryObj: {}, //作为name的映射
    };
  },
  components: {
    SearchBox,
    ProductTable,
  },
  created() {
    categoryApi.list(this.searchForm).then((res) => {
      //   console.log(res);
      this.categoryList = res.data;
      res.data.forEach((item) => {
        this.categoryObj[item.id] = item.name;
      });
      this.getTableData(); //把它放进then里是因为要同时渲染表格中的类目名称
    });
  },
  methods: {
    searchSubmit(form) {
      // console.log(form);
      this.searchForm = form;
      this.getTableData();
    },
    getTableData() {
      api
        .list({
          page: this.page.current,
          size: this.page.pageSize,
          ...this.searchForm,
        })
        .then((res) => {
          // console.log(res); //但是每个数据都需要一个key值
          this.page.total = res.total;
          //   let that = this;
          this.tableData = res.data.map((item) => {
            // that.categoryList.forEach((c) => {
            //   if (c.id === item.category) {
            //     //找到相应的tableData中的category,并将其名称正确修改
            //     item.category = c.name;
            //   }
            // });
            return {
              ...item,
              key: item.id,
              category: this.categoryObj[item.category],
            };
          });
        });
    },
    changePage(page) {
      this.page = page;
      this.getTableData(); //再重新获取数据
    },
    editProduct(record) {
      this.$router.push({
        name: "ProductEdit",
        params: {
          id: record.id,
        },
      });
    },
    removeProduct(record) {
      this.$confirm({
        title: "确认删除",
        content: () => (
          <div style="color:red;">{`确认删除标题为:${record.title}的商品吗`}</div>
        ),
        onOk: () => {
          productApi
            .remove({
              id: record.id,
            })
            .then(() => {
              console.log(this);
              this.getTableData(); //删完了得重新调用一次
            });
        },
        onCancel() {
          console.log("Cancel");
        },
        class: "confirm-box",
      });
    },
  },
};
</script>

<style lang="less">
.product-list {
  position: relative;
  .product-add-btn {
    position: absolute;
    right: 10px;
    top: 14px;
  }
}
</style>