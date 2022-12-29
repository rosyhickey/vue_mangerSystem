// 项目接口方法统一管理模块文件
// import request from '@utils/request'
import request from '@/utils/request'

/* export const getListAPI = () => {
  // 这里先用这个接口测试下, 如果url以http开头会忽略baseURL, axios直接请求此地址
  return request({
    url: 'http://geek.itheima.net/v1_0/channels'
  })
}
 */

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
