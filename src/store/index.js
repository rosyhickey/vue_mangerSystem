import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用来存储登陆成功之后得到的token
    token: '', // 存储用户token
    userInfo: {} // 存储用户信息(username,nickname,email,user_pic)
  },
  getters: {
    // 昵称 完整写法
    /*     nickname (state) {
      return state.userInfo.nickname
    }, */
    nickname: state => state.userInfo.nickname, // 昵称 简写方法 state是形参 key=>value
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 更新token的mutations函数
    updateToken (state, newToken) {
      state.token = newToken
    },
    // 更新用户信息
    updateUserInfo (state, info) {
      state.userInfo = info
    }
  },
  plugins: [createPersistedState()],
  actions: {
    // 定义初始化用户基本信息的action函数
    async getUserInfo (store) {
      const res = await getUserInfoAPI()
      if (res.data.code === 0) {
        store.commit('updateUserInfo', res.data.data)
      }
    }
  },
  modules: {
  }
})
