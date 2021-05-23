<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片识图区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button class="addCateBtn" type="primary" @click="showAddCategroyDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        show-index
        index-text="#"
        :border="true"
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-button type="primary" v-if="scope.row.cat_level === 0" size="mini"
            >一级</el-button
          >
          <el-button
            type="success"
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            >二级</el-button
          >
          <el-button type="warning" v-else size="mini">三级</el-button>
        </template>
        <!-- 操作 -->
        <template slot="opt" >
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类区域 -->
    <el-dialog
      title="添加分类"
      @close="addCateDialogClosed"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- options用来指定数据源 -->
        <!-- props用来指定配置对象 -->
        <!-- 选择项变化会自动同步到selectedKeys -->
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            :clearable="true"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类的数据列表，默认为空
      cateList: [],
      //总数据条数
      total: 0,
      //为table定义列，一个对象为一列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //表示将当前列，定义为模板列
          type: 'template',
          //表示当前这一列使用模板的名称
          template: 'isOk'
        },
        {
          label: '排序',
          //表示将当前列，定义为模板列
          type: 'template',
          //表示当前这一列使用模板的名称
          template: 'order'
        },
        {
          label: '操作',
          //表示将当前列，定义为模板列
          type: 'template',
          //表示当前这一列使用模板的名称
          template: 'opt'
        }
      ],
      //控制添加分类对话框显示与隐藏
      addCateDialogVisible: false,
      //添加分类的表单数据
      addCateForm: {
        //将要添加分类的名称
        cat_name: '',
        //父级分类的id
        cat_pid: 0,
        //分类的等级，默认添加为1级
        cat_level: '0'
      },
      //添加分类的表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      //父级分类数据列表
      parentCateList: [],
      // props的配置对象
      cascaderProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        expandTrigger: 'hover'
      },
      //选择的父级分类的id数组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    //跳转新的页
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //控制显示多少条数据
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getCateList()
    },
    //点击展示添加分类的对话框
    showAddCategroyDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取父级分类的列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status != 200)
        return this.$message.error('获取父级分类数据失败！')
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    //选择项发生变化触发此函数
    parentCateChange() {
      //如果selectedKeys的length大于0，证明选择了父级分类
      //反之，没有选择任何父级分类
      if (this.selectedKeys.length > 0) {
        //  数组中的最后一项为添加分类的父级分类id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        //  数组中的最后一项为添加分类的父级分类id
        this.cat_pid = 0
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //点击添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201)
          return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getCateList()
      })

      
      this.addCateDialogVisible = false
    },
    //监听添加分类对话框的关闭事件，重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.addCateBtn {
  margin-bottom: 15px
}
</style>
