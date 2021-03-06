# 接口设置

## /getCode 获取验证码

| method | url | params |   resoponse   | 
| :-----: | :--: | :----: | :--:  |
| POST   | /getCode | email,userName |  code(6) |

# 数据库设置 USER
|字段|含义|备注|
|:-:|:-:|:-:|
| username | 用户名 | 唯一 |
| password| 密码| |
| email | 邮箱 | 唯一满足邮箱风格 |
| status | 激活状态 | 1/0 |
| code | 验证码 | |
| appkey | 用户唯一标识 |  |
| reset | 重置密码 | 1/0 |
| ctime | 创建时间 | Date.now() |
| utime | 修改时间 | Date.now() |
 

# 获取验证码逻辑
1. 获取用户传来的用户名密码以及邮箱
  1.1 获取数据失败，返回数据不全
  1.2 获取数据成功， next
2. 判断邮箱是否存在
  2.1 邮箱存在，查看激活状态手激活
    2.1.1 激活 => 返回用户已存在请直接登录。
    2.1.2 未激活 判断时间戳是否大于24小时 
      2.1.2.1 大于24小时，重新产生验证码
      2.1.2.2 小于24小时，直接使用数据库中的二维码
  2.2 邮箱不存在，next
3. 根据所需字段创建用户。
4. 用户信息存储，发送验证码。

# 注册逻辑
1. 获取 用户名，密码，邮箱， code,
  1.1 数据传输不全，返回内容不全
  1.2 next
2. 根据code获取获取u_time, 与现在时间对比。
  2.1 时间差 大于 24*3600*1000 验证码无效。需要重新生成
  2.2 否则 将 status 置为1。

# 登陆逻辑
1. 获取邮箱，密码进行登陆
  1.1 获取数据失败，返回数据不全
  1.2 获取数据成功，next
2. 判断密码用户是否正确
  2.1 正确 返回 appkey username email
  2.2 失败 返回 用户名或者密码错误

# 找回密码
1. 根据邮箱获取验证码。
2. 