// 项目接口方法统一管理模块文件
// import request from '@utils/request'
import request from '@/utils/request'
import store from '@/store'

// axios的5种请求方式:get,post,delete,put,patch
// 1.get : 从服务器获取数据 (参数是 params:{键值对})
// 2.post : 向服务器新增数据 (参数是 data:{键值对})
// 3.delete : 删除服务器上的数据
// 4.put : 完整更新服务器上的数据(一般可用于更新用户的完整信息)
// 5.patch : 部分更新服务器上的数据(例如:只更新用户的手机号)

// 封装具体的接口请求方法   每个方法只负责请求一个url地址
/**
 * 注册接口
 * @param {*} param0 {username,password,repassword 用户名 密码 重复密码}
 * @returns promise对象
 */
export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

/**
 * 登录接口
 * @param {*} param0 {username:用户名  password:密码}
 * @returns promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * 获取用户信息接口
 * @returns promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    // method不写默认就是'get'方式请求
    // 传参给后台: params(查询字符串query), data(请求体body), headers(请求头)
    headers: {
      Authorization: store.state.token
    }
  })
}

/**
 * 获取侧边栏菜单的数据
 * @returns promise对象
 */
export const getMenusAPI = () => {
  return request({
    url: '/my/menus',
    headers: {
      Authorization: store.state.token
    }
  })
}

/**
 * 更新用户基本资料
 * @param {*} param0 {id 用户id email 邮箱 nickname 昵称 user_pic 头像地址 username 用户名}
 * @returns promise对象
 */
export const updateUserInfoAPI = ({ id, email, nickname, user_pic, username }) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      email,
      nickname,
      user_pic,
      username
    }
  })
}

/**
 * 更新 用户头像
 * @param {*} avatar 用户头像的base64字符串
 * @returns promise对象
 */
export const updateAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

/**
 * 更新 用户密码
 * @param {*} param0 {old_pwd, new_pwd, re_pwd 原密码,新密码.重复新密码}
 * @returns promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}
