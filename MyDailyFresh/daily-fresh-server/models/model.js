const mongoose = require('mongoose');

const { Schema } = mongoose;
//每个schema都会映射到一个mongodb的集合(collection)并定义了该集合中的文档(document)的形式

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  code: String,
  appkey: String,
  status: Number,
  role: {//角色
    type: String,
    default: 'consumer',
  },
  c_time: {//创建时间
    type: Number,
    default: Date.now(),
  },
  u_time: {//更新时间
    type: Number,
    default: Date.now(),
  },

});

const productSchema = new Schema({
  appkey: String,
  id: Number,
  title: String,
  desc: String,
  category: Number,
  c_item: String,
  tags: Array,
  price: Number,
  price_off: Number,
  images: Array,
  unit: {
    type: String,
    default: 'g',
  },
  inventory: {
    type: Number,
    default: 0,
  },
  name: String,
  number: String,
  updateTime: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: Number,
    default: 1,
  },
  sale: {
    type: Number,
    default: 0,
  },
});

const categorySchema = new Schema({
  id: Number,
  name: String,
  c_items: Array,
  appkey: String,
});
const Counter = new Schema({
  id: String,
  sequence_value: Number,
  appkey: String,
});
//将表的数据结构和表关联起来
exports.product = mongoose.model('Product', productSchema);
exports.category = mongoose.model('Category', categorySchema);
exports.counter = mongoose.model('Counter', Counter);
exports.user = mongoose.model('User', userSchema);
