<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini">添加分类</el-button>
      </div>
      <el-table style="width: 100%" border stripe :data="cateList">
        <!-- type是table-column内置属性，你告诉他用index，意思就是第一个单元格用索引值-->
        <el-table-column label="序号" width="100" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getArtCateListAPI } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      // 文章分类列表
      cateList: []
    }
  },
  created () {
    // 调用方法获取文章分类
    this.getCateListFn()
  },
  methods: {
    // 获取文章分类方法
    async getCateListFn () {
      const res = await getArtCateListAPI()
      console.log('文章分类返回', res.data)
      this.cateList = res.data.data
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
