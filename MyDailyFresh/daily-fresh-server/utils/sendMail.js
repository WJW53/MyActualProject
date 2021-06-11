const nodemailer = require('nodemailer');

async function main(mail, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mxhichina.com',
    port: 465,
    auth: {
      user: 'yongzhi.ding@duyi-inc.com',
      pass: 'Welcome2duyi',
    },
  });

  const info = await transporter.sendMail({
    from: 'duyi-inc<yongzhi.ding@duyi-inc.com>', //
    to: mail,
    subject: '激活验证码',
    text: `您的激活码为：${code}，验证码24小时有效，请于有效期内进行验证`,
  });
}

module.exports = main;
