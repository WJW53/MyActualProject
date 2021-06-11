const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const cors = require('cors');
const indexRouter = require('./routes/index');//写好的接口处理数据
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const categoryRouter = require('./routes/category');
const uploadRouter = require('./routes/upload');
const goodsRouter = require('./routes/goods');
const passPort = require('./routes/login');

const app = express();

app.use(cors({ credentials: true }));//允许发送cookie

mongoose.connect('mongodb://localhost/mall-admin');
const db = mongoose.connection;
// 连接成功
db.on('open', () => {
  console.log('MongoDB Connection Successed');
});
// 连接失败
db.on('error', () => {
  console.log('MongoDB Connection Error');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));//添加日志记录的
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  const whitePath = '/passport/';
  console.log(req.url);
  if (req.url.startsWith(whitePath)) {
    next();
  } else {
    let appkey;
    if (req.method.toUpperCase() === 'GET') {
      appkey = req.query.appkey;
    } else if (req.method.toUpperCase() === 'POST' || req.method.toUpperCase() === 'PUT' || req.method.toUpperCase() === 'DELETE') {
      appkey = req.body.appkey || req.query.appkey;
    }
    if (appkey) {
      next();
    } else {
      res.json({
        msg: '无appkey',
      });
    }
  }
});
app.use('/', indexRouter);//添加这些路由
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/category', categoryRouter);
app.use('/upload', uploadRouter);
app.use('/goods', goodsRouter);
app.use('/passport', passPort);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
