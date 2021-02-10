<template>
  <a-table
    :columns="columns"
    :data-source="tableData"
    :pagination="page"
    @change="changePage"
  >
    <div slot="operation">
      <a-button>编辑</a-button>
      <a-button>删除</a-button>
    </div>
  </a-table>
</template>
<script>
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "ID",
  },
  {
    title: "标题",
    dataIndex: "title",
    key: "title",
    ellipsis: true,
  },
  {
    title: "描述",
    dataIndex: "desc",
    key: "desc",
    ellipsis: true,
  },
  {
    title: "类目",
    dataIndex: "category",
    key: "category",
    ellipsis: true,
    // customRender: function (text, record) {
    //   this.categoryList.forEach((c) => {
    //     if (c.id === record.category) {
    //       console.log(c.name);
    //       // return this.tableData.category = c.name;
    //     }
    //   });
    // },
  },

  {
    title: "预售价格",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "折扣价格",
    dataIndex: "price_off",
    key: "price_off",
  },
  {
    title: "标签",
    dataIndex: "tags",
    key: "tags",
  },
  {
    title: "限制购买数量",
    dataIndex: "inventory",
    key: "inventory",
  },
  {
    title: "上架状态",
    dataIndex: "status",
    key: "status",
    customRender: function (text, record) {
      // console.log(text,record);
      return record.status === 1 ? "上架" : "下架";
    },
  },
  {
    title: "操作",
    dataIndex: "operation",
    key: "operation",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  props: ["tableData", "page"],
  data() {
    return {
      columns,
    };
  },
  computed: {},
  methods: {
    changePage(page) {
      // console.log(page);
      this.$emit("change", page);
    },
  },
};
</script>
