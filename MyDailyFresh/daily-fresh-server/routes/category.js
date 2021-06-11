const express = require('express');

const router = express.Router();
const model = require('../models/model');

const Category = model.category;
const Counter = model.counter;
//关于商品类目的接口
async function getCategoryId(appkey) {
  const doc = await Counter.find({
    id: 'category_id',
    appkey,
  });
  if (doc.length) {
    return doc[0].sequence_value + 1;
  }
  const categoryCounter = new Counter({
    sequence_value: 0,
    appkey,
    id: 'category_id',
  });
  await categoryCounter.save();
  return 0;
}
/* GET home page. */
router.get('/all', async (req, res) => {
  const { size, page, appkey } = req.query;
  const total = await Category.find({ appkey }).count();
  Category.find({
    appkey,
  }).skip((page - 1) * size).limit(Number(size)).exec((err, doc) => {
    if (err) {
      res.send({
        status: 'fail',
        msg: err,
        data: null,
      });
      return false;
    }
    res.send({
      status: 'success',
      msg: '成功',
      data: {
        data: doc,
        total,
      },
    });
    res.end();
    return false;
  });
});

router.post('/add', async (req, res) => {
  const {
    id,
    name,
    c_items,
    appkey = req.query.appkey,
  } = req.body;
  const isExist = await Category.find({ id, appkey });
  if (isExist && isExist.length > 0) {
    res.send({
      status: 'fail',
      msg: 'id已存在',
      data: null,
    });
    res.end();
    return false;
  }
  const t = new Category({
    id,
    name,
    c_items,
    appkey,
  });
  const categoryId = await getCategoryId();
  t.save().then((doc) => {
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
  Counter.update({ id: 'category_id', appkey }, { sequence_value: categoryId }).then((result) => {
    console.log('更新成功', result);
  });

  return false;
});

router.put('/edit', async (req, res) => {
  const {
    id,
    name,
    c_items,
    appkey = req.query.appkey,
  } = req.body;
  Category.update({
    id,
    appkey,
  }, {
    id,
    appkey,
    name,
    c_items,
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
    return false;
  }).catch((err) => {
    console.log(err);
    res.send({
      status: 'fail',
      msg: err,
      data: null,
    });
    return false;
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const appkey = req.body.appkey || req.query.appkey;
  console.log(id, appkey);
  Category.remove({
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
  }).catch((err) => {
    console.log(err);
    res.send({
      status: 'fail',
      msg: err,
      data: null,
    });
  });
});


module.exports = router;
