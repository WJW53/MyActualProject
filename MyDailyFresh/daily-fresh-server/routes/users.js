const express = require('express');

const router = express.Router();
const model = require('../models/model');
//用户角色控制的接口
const User = model.user;
// 修改用户角色

router.put('/role/edit', async (req, res) => {
  const { username, appkey, role } = req.body;
  if (!username || !appkey || !role) {
    return res.json({
      msg: '请求参数出错',
      status: 'fail',
    });
  }
  try {
    const result = await User.find({
      username,
      appkey,
    });
    if (result.length > 0) {
      await User.update({ appkey, username }, { $set: { status: 1, u_time: Date.now(), role } });
      res.json({
        msg: '修改成功',
        status: 'success',
      });
    } else {
      res.json({
        msg: '未找到该用户信息',
        status: 'fail',
      });
    }
  } catch (e) {
    res.json({
      msg: e,
      status: 'fail',
    });
  }
});


module.exports = router;
