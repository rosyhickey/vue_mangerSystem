<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateShowDialogBtnFn()"
          >添加分类</el-button
        >
      </div>
      <el-table style="width: 100%" border stripe :data="cateList">
        <!-- type是table-column内置属性，你告诉他用index，意思就是第一个单元格用索引值-->
        <el-table-column
          label="序号"
          width="100"
          type="index"
        ></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="updateFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加分类的对话框 -->
      <!-- el-dialog是一个对话框组件, 其实也是一个标签, 设置visible属性值为true, 此标签出现, 平时css方式隐藏 -->
      <!-- .sync作用实现双向数据绑定
            会在运行时给所在标签绑定 @update:属性名的事件, 把接收到子组件内传来的值赋予给右侧Vue变量
            组件内$emit('update:visible', true)
            这个update: 是固定的
            -->
      <el-dialog
        title="添加文章分类"
        :visible.sync="addVisible"
        width="35%"
        @closed="dialogClosedFn"
      >
        <span>这是一段信息</span>
        <!-- 添加的表单 -->
        <el-form
          :model="addForm"
          :rules="addRules"
          ref="addRef"
          label-width="80px"
        >
          <el-form-item label="分类名称" prop="cate_name">
            <el-input
              v-model="addForm.cate_name"
              minlength="1"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input
              v-model="addForm.cate_alias"
              minlength="1"
              maxlength="15"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelFn">取 消</el-button>
          <el-button size="mini" type="primary" @click="addFn">添 加</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 经验:如果用同一个按钮，想要做状态区分
// 1.定义一个标记变量isEdit (true编辑，false新增)，还要定义本次要编辑的数据唯一id值,editId
// 2．在点击修改的时候，isEdit改为true, editId保存要修改的数据id
// 3．在点击新增按钮的时候，isEdit改为false, editId置空
// 4．在点击保存按钮时(确定按钮时)，就可以用isEdit变量做区分了

import { addArtCateAPI, getArtCateListAPI, updateArtCateAPI } from '@/api'
export default {
  name: 'ArtCate',
  data () {
    return {
      // 文章分类列表
      cateList: [],
      // 添加分类的弹窗Boolean值
      addVisible: false,
      // 要修改的文章id
      editId: '',
      // 保存编辑状态 false新增 true编辑
      isEdit: false,
      // 添加表单的数据对象
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 添加表单的验证规则对象
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            pattern: /^\S{1,10}$/,
            message: '分类名必须是1-10位的非空字符',
            trigger: 'blur'
          }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    // 调用方法获取文章分类
    this.getCateListFn()
  },
  methods: {
    // 获取文章分类列表方法
    async getCateListFn () {
      const res = await getArtCateListAPI()
      // console.log('文章分类返回', res.data)
      this.cateList = res.data.data
    },

    // 添加分类点击按钮事件 显示添加分类弹窗
    addCateShowDialogBtnFn () {
      this.isEdit = false // 变回新增状态编辑
      this.editId = ''
      this.addVisible = true
    },

    // 取消添加分类
    cancelFn () {
      // 关闭弹窗
      this.addVisible = false
    },

    // 确认添加分类
    async addFn () {
      // 添加操作
      // 表单预校验
      this.$refs.addRef.validate(async (valid) => {
        if (valid) {
          // 校验成功 调用接口传递数据给后台
          // 根据isEdit的值判断是要进行修改还是新增操作,从而调用不同的api接口
          if (this.isEdit) {
            // 要修改
            this.addForm.id = this.editId
            const { data: res } = await updateArtCateAPI(this.addForm)
            // console.log('修改的res', res)
            if (res.code !== 0) return this.$message.error('修改失败!')
            this.$message.success('修改成功!')
          } else {
            // 要新增
            const { data: res } = await addArtCateAPI(this.addForm)
            if (res.code !== 0) return this.$message.error('添加分类失败!')
            this.$message.success('添加分类成功!')
          }
          // 重新请求列表数据
          this.getCateListFn()
          // 关闭弹窗
          this.addVisible = false
        } else {
          return false
        }
      })
    },

    // 定义添加分类弹窗关闭的触发事件函数 清空添加表单
    dialogClosedFn () {
      // console.log(this.$refs)
      this.$refs.addRef.resetFields()
    },

    // 修改分类按钮事件 设置弹窗回显数据
    updateFn (obj) {
      // console.log(obj)
      // 显示添加分类的弹窗
      this.addVisible = true
      // 设置编辑状态
      this.isEdit = true
      this.editId = obj.id
      // 所选那行的数据回显到弹窗内
      // 使用$nextTick()解决第一次点击修改再点击添加列表未置空的bug
      this.$nextTick(() => {
        // 先让对话框出现, 它绑定空值的对象, 才能resetFields清空用初始空值
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
        // 让el-dialog第一次挂载el-form时，先用addForm空字符串初始值绑定到内部，后续用作resetFields重置
        // 所以让真实DOM先创建并在内部绑定好复制好初始值
        // 接着我们真实DOM更新后绑定好了，咱们再给数据回显
        // 注意:我们给v-model对象赋值只是影响当前显示的值，不会影响到resetFields复制的初始值
      })
    }
  }
}

// 小bug: (el-form和el-dialog和数据回显同时用，有bug)
// 复现:第一次打开网页，先点击修改，再点击新增，发现输入框竟然有值//原因:点击修改后，关闭对话框的时候，置空失效了
// 具体分析:主人公resetFields有问题
// 线索:Dialog的内容是懒渲染的，即在第一次被打开之前，传入的默认slot 不会被渲染到 DOM 上
// 线索:vue数据改变(先执行同步所有)再去更新DOM(异步代码)

// 无问题:第一次打开网页，先点击新增按钮- dialog出现-> el-form组件第一次挂载（关联的addForm对象的属性的值为空字符串)el-form组件内绑定了初始值，
// 所以后续调用resetFields的时候，它可以用到空字符串初始值来重置

// 有问题:第一次打开网页，先点击修改按钮->虽然dialog变量为true了但是同步代码把addForm对象里赋值了(默认值)
// ->DOMN更新异步-> dialog出现 -> el-form组件第一次挂载(使用addFonm内置做回显然后第一次el-form内绑定了初始值(有值))->以后做重置,
// 它就用绑定的带值的做重置

</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
