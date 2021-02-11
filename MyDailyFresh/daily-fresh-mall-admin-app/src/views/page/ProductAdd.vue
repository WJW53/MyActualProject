<template>
  <div class="product-add">
    <a-steps :current="current" class="product-steps">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div class="steps-content">
      <basic-details
        v-if="current === 0"
        @next="next"
        :form="form"
      ></basic-details>
      <sale-details
        v-else-if="current === 1"
        @next="next"
        @prev="prev"
        :form="form"
      ></sale-details>
    </div>
  </div>
</template>

<script>
import BasicDetails from "@/components/BasicDetails.vue";
import SaleDetails from "@/components/SaleDetails.vue";
import productAddApi from "@/api/product.js";

export default {
  components: {
    BasicDetails,
    SaleDetails,
  },
  created() {
    //这是为了判断是新增还是编辑界面的
    let params = this.$route.params;
    if (typeof params.id !== "undefined") {
      productAddApi.detail(params).then((res) => {
        this.form = res;
      });
    }
  },
  data() {
    return {
      current: 0,
      form: {
        title: "",
        desc: "",
        category: "",
        c_items: [],
        tags: [],
        //上面是基本信息,下面是销售信息
        price: 0,
        price_off: 0,
        unit: "kg",
        inventory: 0,
        images: [],
      },
      steps: [
        {
          title: "填写商品基本信息",
          //   content: "First-content",
        },
        {
          title: "填写商品销售信息",
          //   content: "Second-content",
        },
      ],
    };
  },
  methods: {
    next(form) {
      this.form = {
        ...this.form,
        ...form,
      };
      if (this.current === 1) {
        //提交数据,也要区分编辑还是新增
        if (typeof this.$route.params.id !== "undefined") {
          //编辑
          productAddApi.edit(this.form).then((res) => {
            this.$message.success("商品修改成功！");
            this.$router.push({
              name: "ProductList",
            });
          });
        } else {
          //新增
          productAddApi.add(this.form).then((res) => {
            //就已经加到后台数据里啦,当再次查看就能看到啦
            //   console.log(res);
            this.$message.success("商品新增成功！");
            this.$router.push({
              name: "ProductList",
            });
          });
        }
      } else {
        this.current++;
      }
    },
    prev() {
      this.current--;
    },
  },
};
</script>
<style lang="less">
.product-add {
  .product-steps {
    width: 50%;
    margin: 20px auto;
  }
  .steps-content {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
  }

  .steps-action {
    margin-top: 24px;
  }
}
</style>