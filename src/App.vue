<template>
    <!-- 一级路由规则对象挂载点 -->
    <router-view></router-view>
</template>

<script>

// import { getUserInfoAPI } from '@/api'
export default {
  created () {
    // getUserInfoAPI().then(res => {
    //   console.log(res)
    // })
    // this.$store.dispatch('getUserInfo')
  }
}
</script>

<style scoped>

</style>
