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

/**
 * 获取文章分类
 * @returns promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 添加文章分类
 * @param {*} param0 cate_name 文章分类名字 cate_alias 文章分类别名
 * @returns promise对象
 */
export const addArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}

/**
 * 修改文章分类接口
 * @param {*} param0 { id 分类id, cate_name 分类名字, cate_alias 分类别名 }
 * @returns promise对象
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}

/**
 * 删除分类接口
 * @param {*} id 分类id
 * @returns promise对象
 */
export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

/**
 * 发布文章
 * @param {*} fd 表单对象
 * @returns promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd // 参数要的是表单对象 不能写普通对象 axios内部会判断 如果是表单对象 传递的请求体会设置Conten-TypeLform-data与后端对应
  })
}

/**
 * 获取文章列表
 * @param {*} param0  {
 *    pagenum, 当前页码数
      pagesize, 当前页条数
      cate_id,  文章分类id
      state}  文章状态
 * @returns promise对象
 */
export const getArtcleListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取文章详情
 * @param {*} id 文章id
 * @returns promise对象
 */
export const getArticleDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }
  })
}

/**
 * 删除文章接口
 * @param {*} id 文章id
 * @returns promise对象
 */
export const deleteArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
