<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <!-- :inline:true 让el-form的几个表单域在同一行显示,要记得加冒号 不然后面的true或false就默认为字符串 -->
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
               <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
        <!-- 发表文章的 Dialog 对话框 -->
        <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose" @closed="onDialogClosedFn" class="duihuakuang">
        <!-- 发布文章的对话框 -->
          <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>

            <el-form-item label="文章分类" prop="cate_id">
              <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
                <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
              <!-- 使用 v-model 进行双向的数据绑定 -->
              <quill-editor v-model="pubForm.content" @change="contentChangeFn"></quill-editor>
            </el-form-item>

            <el-form-item label="文章封面">
              <!-- 用来显示封面的图片 -->
              <!-- <img v-if="!this.pubForm.cover_img" src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" /> -->
              <!-- <img v-else :src="this.pubForm.cover_img" alt="" class="cover-img" ref="imgRef" /> -->
              <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
              <br />
              <!-- 文件选择框，默认被隐藏 -->
              <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="onCoverChangeFn" />
              <!-- 选择封面的按钮 -->
              <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
              <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
            </el-form-item>

          </el-form>
        </el-dialog>
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI } from '@/api'
// 标签和样式中，引入图片文件直接写"静态路径"(把路径放在js的vue变量里再赋予是不行的)
// 原因: webpack分析标签的时候，如果src的值是一个相对路径，它会去帮我们找到那个路径的文件并一起打包
// 打包时候，会分析文件的大小，小图转成base64字符串再赋予给src，如果是大图拷贝图片换个路径给img的src显示(运行时)

// Vue变量中路径，赋予给标签，都会当做普通的字符串使用
// 以前:我们写的路径是在vscode看着文件夹写的（以前好使的原因:你用live Server/
// 磁盘双击打开，它都能通过你的相对路径，在指定路径文件夹下，找到图片文件真身)
// 现在:写的模板代码，是要被webpack翻译处理转换的，你vscode里的代码，转换后打包到内存中/dist下，相对路径就会变化，运行时,你写的固定路径字符串就找不到那个文件真身了
// 解决:""S里引入图片，就用import引入",让webpack把它当做模块数据，是转换成打包后的图片路径还是base64字符串
// 注意:只有相对路径本地图片需要注意，如果你是一个http://外链的图片地址，就可以直接用
// 直接标签里写也行，或者在js用变量保存后赋予给标签都ok，因为运行时，浏览器发现src地址是外链就不找相对路径文件夹了

// 因为图片路径只能在html里或者css里写,不可以在js里面写图片路径,所以把路径导为一个变量
// webpack会把图片变为一个base64字符串/在打包后的图片临时地址

// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data () {
    return {
      // 存储分类数据
      cateList: '',
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      // 定义是否显示发布文章弹窗的变量
      pubDialogVisible: false,

      pubForm: { // 表单的数据对象
        title: '',
        cate_id: '',
        content: '', // 文章内容
        cover_img: null, // 封面图片
        state: '' // 发布状态:发布/存为草稿
      },
      pubFormRules: { // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        // 为何这个输入内容了，校验还不自己去掉?
        // 原因:
        // content对应quill-editor富文本编辑器，它不是el提供表单标签l/ el-input等输入框的在blur事件时进行校验
        // 下拉菜单，单选框，复选框，是在change事件时进行校验
        // 解决:
        // 自己来给quill-editor绑定change事件(在文档里查到的它支持change事件内容改变事件)
        // 在事件处理函数中用el-form组件对象内，调用某个校验规则再重新执行（validateField)

        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'change' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'blur' }]
      }
    }
  },
  // 请求分类数据
  created () {
    this.getCateListFn()
  },

  methods: {
    // 点击发表文章显示弹窗
    showPubDialogFn () {
      this.pubDialogVisible = true
    },

    // 关闭弹窗时提示
    async handleClose (done) { // done的作用,调用才会放行,关闭对话框
      // 询问用户是否关闭
      const confirmResult = await this.$confirm('关了东西没了确定关吗?', {
        // 选择是否关闭
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消关闭
      if (confirmResult === 'cancel') return false
      // 确认关闭
      done()
    },

    // 初始化文章分类的列表数据
    async getCateListFn () {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },

    // 选择封面图片点击事件
    chooseImgFn () {
      this.$refs.iptFileRef.click()
    },

    // 封面选择改变的事件
    onCoverChangeFn (e) {
      // 获取用户选择的文件列表
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        // 用户选择了封面
        this.pubForm.cover_img = files[0]
        // 渲染图片到页面
        /*         const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.onload = async e => {
        this.pubForm.cover_img = e.target.result
        } */
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      // 表单单独校验封面规则
      this.$refs.pubFormRef.validateField('cover_img')
    },

    // 点击发布或者存为草稿按钮触发事件 调用后台接口
    pubArticleFn (str) {
      // 设置发布状态
      this.pubForm.state = str
      // console.log(this.pubForm)
      // 表单预校验
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善文章信息!')
        // 判断是否提供文章封面
        if (!this.pubForm.cover_img) return this.$message.error('请选择文章封面!')
        // 符合校验 发布文章
        // console.log(this.pubForm)
        // 创建FormData对象
        const fd = new FormData()
        // 向FormData里面追加数据
        // Object.keys(this.pubForm).forEach((key) => {
        //   fd.append(key, this.pubForm[key])
        // })
        fd.append('title', this.pubForm.title)
        fd.append('cate_id', this.pubForm.cate_id)
        fd.append('content', this.pubForm.content)
        fd.append('cover_img', this.pubForm.cover_img)
        fd.append('state', this.pubForm.state)

        console.log()
        // 发起请求
        const { data: res } = await uploadArticleAPI(fd)
        // console.log(res)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 关闭对话框
        this.pubDialogVisible = false
      })
    },

    // 当发布文章的对话窗关闭后清空对话框的内容
    onDialogClosedFn () {
      // 清空表单
      this.$refs.pubFormRef.resetFields()
      // 清除文章内容和封面图片
      this.pubForm.content = ''
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },

    // 富文本编辑器输入内容后触发事件 不再提示无内容
    contentChangeFn () {
      this.$refs.pubFormRef.validateField('content')
    }
  }
}

// $confirm内部虽然是一个确认提示框，但是它借用了Promise语法来管理，点击确定它的状态为兑现成功状态返回' confirm'，
// 如果用户点击了取消按钮，此Promise对象状态为拒绝状态，返回' cancel'字符串

// 知识点回顾:
// 1.await只能用在被async修饰的函数内
// async修饰:就是在当前函数名左边加async关键字，如果没有函数名，在形参的左边加async
// 原因: async修饰的函数就是异步函数，如果此函数被调用，总是返回一个全新Promise对象
// 而且本次函数调用因为是异步函数，所以外面的同步代码继续执行，而await暂停代码只能暂停async函数内的,等待await后面异步结果
// 2. await只能拿到成功的结果
// 3. await后面的Promise的对象的拒绝状态(错误)如何捕获呢?
// 方法1: try{} catch(err){]}
// 方式2:用Promise的链式调用，而且在catch里return的非Promise拒绝状态的对象值，都会当做成功的结果返回给原地新的Promise对象结果

</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

// 设置富文本编辑器的默认最小高度
// ::v-deep作用: 穿透选择, 正常style上加了scope的话, 会给.ql-editor[data-v-hash]属性, 只能选择当前页面标签或者组件的根标签
// 如果想要选择组件内的标签(那些标签没有data-v-hash值)所以正常选择选不中, 加了::v-deep空格前置的话, 选择器就会变成如下形式
// [data-v-hash] .ql-editor 这样就能选中组件内的标签的class类名了
// 总结: scoped不会给组件内的标签添加data-v属性，所以你要用::v-deep 穿透选择组件内的标签设置样式
::v-deep .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

// .duihuakuang{
//   width: 400px;
//   height: 200px;
//   // text-align: center;
//   // margin-top: 50%;
//   position: fixed;
//   /* 设置 top 和 left 为 50%，使弹窗的元素左上角在窗口的中心点 */
//   top: 50%;
//   left: 50%;
//   /* 通过 margin 的 上外边 和 左外边的值为 元素尺寸的 -50% 时，刚好让元素偏移位置窗口的中间 */
//   margin: -130px 0 0 -150px;
// }
</style>
