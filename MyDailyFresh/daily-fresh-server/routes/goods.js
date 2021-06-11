const express = require('express');

const router = express.Router();
const model = require('../models/model');

const Product = model.product;
const C = model.category;
// const Counter = model.counter;
// 模糊搜索
router.get('/likeSearch', async (req, res) => {
  const { likeValue, appkey } = req.query;
  try {
    const value = await C.find({ appkey });
    const result = value.reduce((prev, next) => prev.concat(next.c_items), []).filter((item) => item.includes(likeValue));
    console.log(result);
    res.json({
      count: result.length,
      result,
    });
  } catch (error) {
    console.log(error);
    res.end('null');
  }
});
// 搜索
router.get('/search', async (req, res) => {
  const {
    type, page, size, appkey,
  } = req.query;
  const result = await Product.find({ title: { $regex: String(type) }, appkey });
  res.json({
    list: result.slice((page - 1) * size, page * size),
    total: result.length,
  });
});
// 商品列表
router.get('/getGoodsList', async (req, res) => {
  const {
    type, page, size, sort, appkey,
  } = req.query;
  let value = null;
  if (String(type).charCodeAt() <= 57) {
    value = await Product.find({ category: type, appkey });
  } else {
    value = await Product.find({ c_item: type, appkey });
  }
  if (sort == 'price-down') {
    value.sort((a, b) => b.price - a.price);
  }
  if (sort == 'price-up') {
    value.sort((a, b) => a.price - b.price);
  }

  if (sort == 'sale') {
    value.sort((a, b) => a.sale - b.sale);
  }

  if (sort == 'all') {
    value.sort();
  }

  res.json({
    total: value.length,
    list: value.slice((page - 1) * size, page * size),
  });
});

// 二级导航
router.get('/getsidebar', async (req, res) => {
  const { type, appkey } = req.query;
  const value = await C.find({ name: type, appkey }, { id: 1, c_items: 1 });
  let result = [];
  if (value[0]) {
    result = [value[0].id, ...value[0].c_items];
  } else {
    const value = await C.find({ name: '时令水果', appkey }, { id: 1, c_items: 1 });
    result = [value[0].id, ...value[0].c_items];
  }
  res.json(result);
});

router.get('/getGoodsByIds', async (req, res) => {
  const { value: ids, appkey } = req.query;
  const lists = ids.split(',');
  const value = await Promise.all(lists.map((item) => Product.find({ id: item, appkey })));
  const list = value.reduce((prev, next) => prev.concat(next), []);
  res.json({
    length: list.length,
    list,
  });
});

// 根据产品id获取产品

module.exports = router;
