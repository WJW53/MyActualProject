const express = require('express');

const router = express.Router();
const model = require('../models/model');

const Product = model.product;
const Counter = model.counter;
// const fs = require('fs')
// const path = require('path')
/* GET home page. */
//关于商品信息的接口等
async function getProduceId(appkey) {
  const doc = await Counter.find({
    id: 'product_id',
    appkey,
  });
  if (doc.length) {
    return doc[0].sequence_value + 1;
  }
  const productCounter = new Counter({
    sequence_value: 0,
    id: 'product_id',
    appkey,
  });
  productCounter.save();
  return 0;
}
//获取商品列表
router.get('/all', async (req, res) => {
  const {
    size, page, searchWord, category, appkey,
  } = req.query;
  const filterData = {
    appkey,
  };
  if (searchWord) {//有关键字的时候
    filterData.name = {
      $regex: new RegExp(searchWord, 'g'),
    };
  }
  if (category) {
    filterData.category = {
      $in: category ? [Number(category)] : [],
    };
  }

  let total = 0;
  await Product.find(filterData).count().then((data) => {
    total = data;
  });

  Product.find(filterData).skip((page - 1) * size).limit(Number(size)).exec((err, doc) => {
    if (err) {
      res.send(err);
      res.end();
    } else {
      res.send({
        status: 'success',
        msg: '成功',
        data: {
          data: doc,
          total,
        },
      });
      res.end();
    }
  });
});//添加
router.post('/add', async (req, res) => {
  const {
    appkey = req.query.appkey,
    title,
    desc,
    category,
    c_item,
    price_off,
    tags,
    price,
    images,
    unit,
    inventory,
    name,
    number,
    status,
    sale = 0,
  } = req.body;
  const productId = await getProduceId(appkey);
  console.log(productId);
  const p = new Product({
    id: productId,
    title,
    desc,
    category,
    c_item,
    price_off,
    tags,
    price,
    images,
    unit,
    inventory,
    name,
    number,
    status,
    appkey,
  });
  p.save().then((doc) => {
    console.log('添加成功', doc);
    res.send({
      status: 'success',
      msg: '成功',
      data: {
        data: doc,
      },
    });
    res.end();
  }).catch((err) => {
    console.log(err);
    res.send({
      status: 'fail',
      msg: err,
      data: null,
    });
  });
  Counter.update({ id: 'product_id', appkey }, { sequence_value: productId }).then((result) => {
    console.log('更新成功', result);
  }).catch((err) => {
    console.log(err);
    res.send({
      status: 'fail',
      msg: err,
      data: null,
    });
  });
});
//获取
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { appkey } = req.query;
  console.log(id, appkey);
  Product.find({
    id,
    appkey,
  }).exec((err, doc) => {
    if (err) {
      res.send({
        status: 'fail',
        msg: err,
        datat: null,
      });
      return;
    }
    console.log(doc);
    res.send({
      status: 'success',
      msg: '成功',
      data: doc[0],
    });
  });
});
//编辑
router.put('/edit', async (req, res) => {
  const {
    appkey = req.query.appkey,
    _id,
    id,
    title,
    desc,
    category,
    c_item,
    tags,
    price,
    price_off,
    images,
    unit,
    inventory,
    name,
    number,
    status,
  } = req.body;
  Product.update({
    _id,
    appkey,
  }, {
    id,
    appkey,
    title,
    category,
    c_item,
    desc,
    tags,
    price,
    price_off,
    images,
    unit,
    inventory,
    name,
    number,
    status,
  }).then((doc) => {
    console.log('更新成功');
    res.send({
      status: 'success',
      msg: '成功',
      data: {
        data: doc,
      },
    });
    res.end();
  });
});
//删除
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const appkey = req.body.appkey || req.query.appkey;
  Product.remove({
    id,
    appkey,
  }).then((doc) => {
    console.log('删除成功');
    res.send({
      status: 'success',
      msg: '成功',
      data: {
        data: doc,
      },
    });
    res.end();
  });
});

module.exports = router;
