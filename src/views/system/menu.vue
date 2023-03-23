<template>
  <BaseContainer>
    <el-row style="padding-bottom: 20px">
      <el-form ref="queryForm" :model="queryForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="菜单名称" prop="title">
              <el-input
                v-model="queryForm.title"
                placeholder="请输入菜单名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button type="warning" @click="resetQuery">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-row>
    <el-row style="padding-bottom: 20px">
      <div slot="header" class="clearfix">
        <strong>操作栏</strong>
        <el-button style="float: right; margin-left: 8px" type="danger" @click="handleBatchDelete">删除</el-button>
        <el-button style="float: right; margin-left: 8px" type="success" @click="handleAdd">添加</el-button>
      </div>
      <div>
        <el-table
          :data="table.data"
          row-key="id"
          :header-cell-style="{background:'#E4E7ED',color:'#303133'}"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55"/>
          <el-table-column prop="title" align="center" label="菜单名称"/>
          <el-table-column prop="path" align="center" label="请求路径"/>
          <el-table-column align="center" label="类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === 1" type="success" size="medium">目录</el-tag>
              <el-tag v-if="scope.row.type === 2" type="primary" size="medium">菜单</el-tag>
              <el-tag v-if="scope.row.type === 3" type="warning" size="medium">权限</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" align="center" label="排序"/>
          <el-table-column prop="createTime" align="center" label="创建时间" width="280"/>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" style="color: red" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          v-show="table.total>0"
          :total="table.total"
          :page.sync="queryForm.current"
          :limit.sync="queryForm.size"
          @pagination="getTableData"
        />
      </div>
    </el-row>
    <!--弹窗-->
    <el-dialog :title="form.title" :visible.sync="form.dialog" width="30%">
      <el-form ref="form" :model="form.data" :rules="form.rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.data.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.data.roleCode" placeholder="请输入角色编码"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.data.sort" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">{{ form.button }}</el-button>
          <el-button type="info" @click="form.dialog =false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </BaseContainer>
</template>

<script>
import { apiDelete, apiPage, apiSave, apiUpdate } from '@/api/system/menu'

export default {
  data() {
    return {
      // 表格
      table: {
        data: [],
        total: 0,
        selection: []
      },
      // 搜索
      queryForm: {
        current: 1,
        size: 10,
        title: undefined
      },
      // 表单
      form: {
        data: {
          roleName: undefined,
          roleCode: undefined,
          sort: undefined
        },
        dialog: false,
        title: '弹窗',
        button: '保存',
        rules: {
          roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
        }
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    handleSelectionChange(val) {
      this.table.selection = val
    },
    handleQuery() {
      this.queryForm.current = 1
      this.getTableData()
    },
    resetQuery() {
      this.$refs['queryForm'].resetFields()
      this.handleQuery()
    },
    getTableData() {
      apiPage(this.queryForm).then(res => {
        const { data } = res
        const { records, total } = data
        this.table.data = records
        this.table.total = total
      })
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.data.id && this.form.data.id !== '') {
            apiUpdate(this.form.data).then(res => {
              const { message } = res
              this.$message.success(message)
              this.form.dialog = false
              this.getTableData()
            })
          } else {
            apiSave(this.form.data).then(res => {
              const { message } = res
              this.$message.success(message)
              this.form.dialog = false
              this.getTableData()
            })
          }
        }
      })
    },
    handleAdd() {
      this.form.data = {
        roleName: undefined,
        roleCode: undefined,
        sort: undefined
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.form.dialog = true
      this.form.button = '保存'
      this.form.title = '添加角色'
    },
    handleEdit(row) {
      this.form.data = row
      this.form.data.password = undefined
      this.form.dialog = true
      this.form.title = '修改角色'
      this.form.button = '修改'
    },
    handleDelete(ids) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDelete(ids).then((res) => {
          const { message } = res
          this.$message.success(message)
          this.getTableData()
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleBatchDelete() {
      if (this.table.selection.length && this.table.selection.length >= 1) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tmpIds = this.selection.map(tmp => tmp.id).join(',')
          apiDelete(tmpIds).then((res) => {
            const { message } = res
            this.$message.success(message)
            this.getTableData()
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      } else {
        this.$message.warning('至少选择一条数据')
      }
    }
  }
}
</script>

<style scoped>

</style>
