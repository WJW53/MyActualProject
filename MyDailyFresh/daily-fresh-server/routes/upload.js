const express = require('express');

const router = express.Router();
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const OSS = require('ali-oss');
//上传图片相关的接口

const client = new OSS({
  region: 'oss-cn-beijing',
  // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
  accessKeyId: 'LTAI4GBAaFsRaPb6Es',
  accessKeySecret: 'h4VFL7TVMcIVmTkpLkmYOR0',
  bucket: 'duyi-bucket',
});
router.post('/images', (req, res) => {
  const form = new formidable.IncomingForm();
  const { appkey } = req.query;
  console.log(appkey);
  form.encoding = 'utf-8';
  form.uploadDir = path.join(__dirname, '/../public/images');
  form.keepExtensions = true;// 保留后缀
  form.maxFieldsSize = 2 * 1024 * 1024;
  // console.log(req)
  // 处理图片
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.send({
        status: 'fail',
        msg: err,
        data: null,
      });
    }
    const filename = files.avatar.name;
    const nameArr = filename.split('.');
    let newName = '';
    for (let i = 0; i < nameArr.length - 1; i += 1) {
      newName += nameArr[i];
    }
    newName = `${newName + new Date().getTime()}.${nameArr[nameArr.length - 1]}`;
    req.files = files.avatar;
    const localPath = `${form.uploadDir}/1.png`;
    fs.renameSync(files.avatar.path, localPath); // 重命名
    const result = await client.put(path.join('mall-admin/images/', newName), localPath);
    if (result.res.status === 200) {
      res.send({
        status: 'success',
        msg: '成功',
        data: {
          name: filename,
          status: 'done',
          url: result.url,
          thumbUrl: result.url,
        },
      });
    } else {
      res.send({
        status: 'fail',
        msg: result.res.statusMessage,
        data: null,
      });
    }

    return false;
  });
});


module.exports = router;
