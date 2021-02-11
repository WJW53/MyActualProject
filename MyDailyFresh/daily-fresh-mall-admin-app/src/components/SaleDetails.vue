<template>
  <div class="sale-details">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 14 }"
    >
      <a-form-model-item label="商品售价" prop="price" required>
        <a-input v-model="form.price" />
      </a-form-model-item>
      <a-form-model-item label="折扣价格" prop="price_off" required>
        <a-input v-model="form.price_off" />
      </a-form-model-item>
      <a-form-model-item label="商品库存" prop="inventory" required>
        <a-input v-model="form.inventory"></a-input>
      </a-form-model-item>
      <a-form-model-item label="计量单位" prop="unit" required>
        <a-input v-model="form.unit"></a-input>
      </a-form-model-item>
      <a-form-model-item label="商品相册" prop="images" required>
        <a-form-model-item label="商品相册" prop="images">
          <a-upload
            :action="
              'http://mallapi.duyiedu.com/upload/images?appkey=' +
              $store.state.user.appkey
            "
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
            name="avatar"
          >
            <div v-if="fileList.length < 8">
              <!-- 这里是loading动画, -->
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
            <a-modal
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancel"
            >
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-upload>
        </a-form-model-item>
      </a-form-model-item>
      <a-form-model-item label="" class="next-btn" :wrapperCol="{ span: 24 }">
        <a-button type="default" @click="prev">上一步</a-button>
        <a-button type="primary" @click="next">提交</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
//这个组件里,基本都是在使用ant-design里的玩意儿,实现的
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  props: ["form"],
  created() {
    if (this.form.images.length > 0) {
      this.fileList = this.form.images.map((item, index) => {
        return {
          //这个结构是因为ant-design人家官方需要这样的
          uid: index,
          name: `image-${index}.png`,
          status: "done",
          url: item,
        };
      });
    }
  },
  data() {
    return {
      // form: {
      //   price: 0,
      //   price_off: 0,
      //   unit: "",
      //   inventory: 0,
      //   images: [],//图片地址
      // },
      rules: {},
      size: "default",
      fileList: [], //图片列表,用这个渲染从后台拿到的图片
      loading: false, //未加载
      previewVisible: false,
      previewImage: "",
    };
  },
  methods: {
    handleChange({ file, fileList }) {
      //上传中,成功,失败,都会调用此函数
      // console.log('change',file,fileList);
      if (file.status === "done") {
        //后台返回的包装好了的数据,这个url是在后台中的地址
        this.form.images.push(file.response.data.url);
      } else if (file.status === "removed") {
        //撤销图片
        const { url } = file.response.data;
        this.form.images = this.form.images.filter((item) => item !== url);
      }
      this.fileList = fileList;
    },
    next() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("next", this.form);
          return true;
        }
        console.log("error submit!!");
        return false;
      });
    },
    prev() {
      // console.log("prev");
      this.$emit("prev");
    },
    async handlePreview(file) {
      //图片预览
      const obj = file; //file不可改变,所以用个obj
      if (!file.url && !file.preview) {
        obj.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleCancel() {
      //撤销图片
      this.previewVisible = false;
    },
  },
};
</script>