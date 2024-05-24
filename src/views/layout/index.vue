<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <!-- <img src="../../assets/images/logo.png" alt="" /> -->
      <h3 style="color:#ffffff;margin-left:20px">rosyhickey文章管理系统</h3>
      <!-- 右侧的菜单 -->
      <el-menu class="el-menu-top" mode="horizontal" background-color="#23262E" text-color="#fff"
        active-text-color="#409EFF">
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img v-if="user_pic" :src="user_pic" alt="" class="avatar" />
            <img v-else src="../../assets/images/logo.png" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item @click="tiaozhuan1"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item @click="tiaozhuan2"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item @click="tiaozhuan3"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="logoutFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <!-- <el-aside width="200px">Aside</el-aside> -->
      <!-- 左侧边栏的用户信息 -->
      <el-aside width="200px">
        <div class="user-box">
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="../../assets/images/logo.png" alt="" v-else />
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 左侧导航菜单 -->
        <!-- el-menu 菜单栏
          default-cative 当前激活菜单的index值,下方菜单的index值跟它相同就显示激活高亮
          unique-opened  是否只保持一个子菜单的展开
       -->
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="#23262E"
          text-color="#fff" active-text-color="#409EFF" unique-opened:false router>
          <template v-for="item in menus">
            <!-- 不包含子菜单的“一级菜单” -->
            <el-menu-item :index="item.indexPath" :key="item.indexPath" v-if="!item.children">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </el-menu-item>
            <!-- 包含子菜单的“一级菜单” -->
            <el-submenu :index="item.indexPath" :key="item.indexPath" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item :index="subItem.indexPath" v-for="subItem in item.children" :key="subItem.indexPath">
                <i :class="subItem.icon"></i>{{subItem.title}}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
        <!-- eslint-disable-next-line  -->
        <div class="el-submenu__title"
          style="padding-left: 20px; color: rgb(255, 255, 255); background-color: rgb(35, 38, 46);">
          <i class="el-icon-user-solid" style="font-size: 20px;"></i>
          <span style="margin-left: 10px;" @click="toCsdn">我的csdn</span>
        </div>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main>
          <!-- 二级路由挂载点 -->
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>欢迎使用rosyhickey的管理系统</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getMenusAPI } from '@/api'
import { mapGetters } from 'vuex'
// 经验:在组件标签上绑定的所有事件(包括原生事件的名字click,input等等)
// 都是自定义事件，都需要组件内$emit来触发才行
// 万一组件内不支持这个原生事件名字
// 解决:@事件名.native="methods里方法名"
// .native给组件内根标签，绑定这个原生的事件

export default {
  name: 'my-layout',
  data () {
    return {
      menus: [] // 侧边栏菜单数据
    }
  },
  created () {
    // 调用方法
    this.getMenusListFn()
  },
  methods: {
    // 退出登录 点击事件
    logoutFn () {
      this.$confirm('您确定退出登陆吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
        // 退出
        // 删除vuex的token,再跳转去login
          this.$store.commit('updateToken', '')
          this.$router.push('/login')
          this.$store.commit('updateUserInfo', {})
        })
        .catch((err) => err)
    },
    // 获取侧边栏菜单数据
    async getMenusListFn () {
      const { data: res } = await getMenusAPI()
      // console.log(res)
      this.menus = res.data
    },
    // 右上角个人中心页面跳转
    tiaozhuan1 () {
      this.$router.push('/user-info')
    },
    tiaozhuan2 () {
      this.$router.push('/user-avatar')
    },
    tiaozhuan3 () {
      this.$router.push('/user-pwd')
    },
    // 跳转csdn
    toCsdn () {
      // eslint-disable-next-line
      location.href = 'https://blog.csdn.net/p_s_p?spm=1000.2115.3001.5343';
    }
  },
  computed: {
    // 使用map映射vuex的getter里面的数据在上面模板中使用
    ...mapGetters(['nickname', 'username', 'user_pic'])
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 12px;
  }
}
// 侧边栏菜单的样式
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
</style>
