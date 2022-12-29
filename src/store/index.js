import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用来存储登陆成功之后得到的token
    token: ''
  },
  getters: {
  },
  mutations: {
    // 更新token的mutations函数
    updateToken (state, newToken) {
      state.token = newToken
    }
  },
  plugins: [createPersistedState()],
  actions: {
  },
  modules: {
  }
})
