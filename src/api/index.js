// 项目接口方法统一管理模块文件
// import request from '@utils/request'
import request from '@/utils/request'
import store from '@/store'

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
