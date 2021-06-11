const express = require('express');
//对于注册、登录账号等模块的设计,重要
const router = express.Router();
const fs = require('fs');
const path = require('path');
const model = require('../models/model');
const { checkEmail, checkUserName, checkNull } = require('../utils/utils');
const sendMail = require('../utils/sendMail');

const Product = model.product;
const Category = model.category;
const User = model.user;
const Counter = model.counter;

function createSixNum() {
  let Num = '';
  for (let i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}
//初始化数据
function initData(appkey) {
  fs.readFile(path.resolve(__dirname, '../utils/products.json'), 'utf-8', (err, data) => {
    console.log(err);
    if (err) {

    } else {
      // console.log(Array.isArray(data));
      let resultData = JSON.parse(data);
      resultData = resultData.map((item, index) => ({
        id: typeof item.id === 'object' ? (item.id.$numberInt || item.id.$numberDouble) : item.id,
        images: item.images.map((img) => img.url),
        title: item.title,
        price: item.price.$numberInt || item.price.$numberDouble,
        price_off: item.price_off ? item.price_off.$numberInt || item.price_off.$numberDouble : item.price_off,
        desc: item.desc,
        tags: item.tags,
        sale: item.sale ? item.sale.$numberDouble || item.sale.$numberInt : '',
        comprehensive: item.comprehensive ? item.comprehensive.$numberDouble || item.comprehensive.$numberInt : '',
        category: item.category ? item.category.$numberInt || item.category.$numberDouble : '',
        inventory: item.inventory ? item.inventory.$numberInt || item.inventory.$numberDouble : '',
        c_item: item.c_item,
        appkey,
      }));
      resultData.forEach((item) => {
        new Product(item).save();
      });
      new Counter({
        appkey,
        sequence_value: resultData.length,
        id: 'product_id',
      }).save();
    }
  });
  fs.readFile(path.resolve(__dirname, '../utils/categories.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log('错误信息：', err);
    } else {
      const resultData = JSON.parse(data);
      resultData.forEach((item) => {
        new Category({
          id: typeof item.id === 'object' ? item.id.$numberInt : item.id,
          name: item.name,
          c_items: item.c_items || [],
          appkey,
        }).save();
      });
      new Counter({
        appkey,
        sequence_value: resultData.length,
        id: 'category_id',
      }).save();
    }
  });
}


// 注册
router.post('/logon', async (req, res) => {
  const {
    username, password, code, email, role = 'coustomer',
  } = req.body;
  if (!checkNull([username, password, code, email])) {
    res.json({
      msg: '注册信息不全，请认真填写',
      status: 'fail',
    });
    return;
  }
  if (!checkUserName(username)) {
    res.json({
      msg: '用户名不合法',
      status: 'fail',
    });
  }
  if (!checkEmail(email)) {
    res.json({ msg: '邮箱不合法', status: 'fail' });
    return;
  }
  const result = await User.find({ code, email });
  if (result.length > 0) {
    if (result[0].status == 1) {
      res.json({
        msg: '该用户已经注册，请直接登陆',
        status: 'fail',
      });
      return;
    }
    const appkey = `${username}_${new Date().getTime()}`;
    await User.update({ code, email }, {
      $set: {
        status: 1, u_time: Date.now(), password, username, appkey, role,
      },
    });
    initData(appkey);
    res.json({
      msg: '注册成功请登录',
      status: 'success',
    });
  } else {
    res.json({
      msg: '验证码无效，请重新获取',
      status: 'fail',
    });
  }
});
//  登陆
router.post('/login', async (req, res) => {
  const { password, email } = req.body;
  const result = await User.find({ password, email, status: 1 });
  if (result.length > 0) {
    res.json({
      status: 'success',
      msg: '登陆成功',
      data: {
        email: result[0].email,
        username: result[0].username,
        appkey: result[0].appkey,
        role: result[0].role,
      },
    });
  } else {
    res.json({
      msg: '用户名或者密码错误',
      status: 'fail',
    });
  }
});
//  获取验证码
router.post('/getCode', async (req, res) => {
  const { email } = req.body;
  if (!checkEmail(email)) {
    res.json({ msg: '邮箱不合法', status: 'fail' });
    return;
  }
  const user = await User.find({ email });
  if (user.length <= 0) {
    const code = createSixNum();
    try {
      await new User({
        email,
        code,
        status: 0,
      }).save();
      await sendMail(email, code);
      res.json({
        status: 'success',
        msg: '验证码发送成功(如果没找到请到垃圾箱里面去找)',
      });
    } catch (error) {
      console.log(error);
      res.end('参数错误');
    }
  } else {
    let { u_time, code } = user[0];
    if (24 * 3600 * 1000 < Date.now() - u_time) {
      code = createSixNum();
      await User.update({ email }, { $set: { code, u_time: Number(Date.now()) } });
    }
    await sendMail(email, code);
    res.json({
      msg: '验证码发送成功(如果没找到请到垃圾箱里面去找)',
      status: 'success',
    });
  }
});
// 找回密码
router.post('/findBack', async (req, res) => {
  const { email, password, code } = req.body;
  if (!checkNull([password, code, email])) {
    res.json({
      msg: '提交信息不全，请认真填写',
      status: 'fail',
    });
    return;
  }
  if (!checkEmail(email)) {
    res.json({ msg: '邮箱不合法', status: 'fail' });
    return;
  }
  const result = await User.find({ code, email });
  if (result.length > 0) {
    await User.update({ code, email }, { $set: { status: 1, u_time: Date.now(), password } });
    res.json({
      msg: '修改成功请登录',
      status: 'success',
    });
  } else {
    res.json({
      msg: '该用户未注册',
      status: 'fail',
    });
  }
});

// 修改用户信息
router.put('/changeUserInfo', async (req, res) => {
  const {
    email, password, newPassword, code, username, role,
  } = req.body;
  if (!checkNull([password, code, email, username])) {
    res.json({
      msg: '提交信息不全，请认真填写',
      status: 'fail',
    });
    return;
  }
  if (!checkEmail(email)) {
    res.json({ msg: '邮箱不合法', status: 'fail' });
    return;
  }
  const result = await User.find({ code, email });
  if (result.length > 0) {
    if (result[0].password !== password) {
      return res.json({
        msg: '原密码不正确',
        status: 'fail',
      });
    }
    if (newPassword) {
      password = newPassword;
    }
    if (!role) {
      role = result[0].role;
    }
    await User.update({ code, email }, {
      $set: {
        status: 1, u_time: Date.now(), password, username, role,
      },
    });
    res.json({
      msg: '修改成功',
      status: 'success',
    });
  } else {
    res.json({
      msg: '该用户未注册',
      status: 'fail',
    });
  }
});
module.exports = router;
