//检查一些格式问题
const checkUserName = (str) => {
  const reg = /^[\w]{2,18}$/;
  return reg.test(str);
};

const checkEmail = (str) => {
  console.log(str);
  const reg = /^(.+)@(.+)\.com$/g;
  return reg.test(str);
};

const checkNull = (arr) => {
  const { length } = arr;
  let flag = true;
  let i = 0;
  while (i < length && flag) {
    if (!arr[i]) {
      flag = false;
    }
    i++;
  }
  return flag;
};

module.exports = {
  checkEmail,
  checkUserName,
  checkNull,
};
