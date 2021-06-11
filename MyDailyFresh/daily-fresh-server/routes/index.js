const express = require('express');

const router = express.Router();
const model = require('../models/model');
const fs = require('fs');
const path = require('path');

const User = model.user;
const marked = require('marked');
/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: '获取appkey' });
});

router.get('/passport/vue-mall-readme', (req, res) => {
  fs.readFile(path.resolve(__dirname, '../public/markdown/index.md'), (err, data) => {
    if (err) {
      console.log(err);
      res.send('文件不存在！');
    } else {
      console.log(data);
      const str = marked(data.toString());
      console.log(str);
      res.json(str);
    }
  });
});
module.exports = router;
