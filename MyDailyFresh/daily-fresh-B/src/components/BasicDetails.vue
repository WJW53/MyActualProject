<template>
  <div class="basic-details">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item label="标题" prop="title" required>
        <a-input v-model="form.title" />
      </a-form-model-item>
      <a-form-model-item label="商品描述" prop="desc">
        <a-input v-model="form.desc" />
      </a-form-model-item>
      <a-form-model-item label="商品类目" prop="category" required>
        <a-select
          v-model="form.category"
          placeholder="请选择商品类目"
          @change="changeCategory"
        >
          <a-select-option v-for="c in categoryList" :key="c.id" :value="c.id">
            {{ c.name }}
          </a-select-option>
        </a-select>
        <a-select v-model="form.c_item" placeholder="请添加子类目">
          <a-select-option v-for="c in categoryItems" :key="c" :value="c">
            {{ c }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="商品标签" prop="tags" required>
        <a-select
          v-model="form.tags"
          mode="tags"
          :size="size"
          placeholder="Please select"
          :default-value="['包邮，最晚次日发']"
          @change="handleChange"
        >
          <a-select-option value="包邮最晚次日发">
            包邮，最晚次日发
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="" class="next-btn" :wrapperCol="{ span: 24 }">
        <a-button type="primary" @click="next">下一步</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import categoryApi from "@/api/category.js";
export default {
  props: ["form"],
  data() {
    return {
      size: "default",
      //   form: {
      //     title: "",
      //     desc: "",
      //     category: "",
      //     c_items: [],
      //     tags: [],
      //   },
      rules: {},
      categoryList: [], //类目
      categoryItems: [], //子类目
    };
  },
  methods: {
    handleChange(value) {
      console.log(`Selected: ${value}`);
    },
    changeCategory(category) {
      //   console.log(category); //实际上是id值
      for (let item of this.categoryList) {
        //找到对应的类目对应的所有子类目
        if (item.id === category) {
          this.categoryItems = item.c_items;
        }
      }
    },
    next() {
      this.$refs.ruleForm.validate((valid) => {
        //   console.log(valid);//valid是校验成功自动的返回结果
        if (valid) {
          this.$emit("next", this.form);
        //   console.log(this.form);
          return true;
        }
        console.log("error submit!!");
        return false;
      });
    },
  },
  created() {
    categoryApi.list(this.form).then((res) => {
      this.categoryList = res.data;
    });
  },
};
</script>

<style lang="less">
</style>