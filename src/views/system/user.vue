<template>
  <BaseContainer>
    <el-row style="padding-bottom: 20px">
      <el-form ref="queryForm" :model="queryForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="queryForm.username"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="昵称" prop="nickname">
              <el-input
                v-model="queryForm.nickname"
                placeholder="请输入昵称"
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
      <el-button-group style="margin-bottom: 25px">
        <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete">删除</el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="handleResetPassword">重置密码</el-button>
      </el-button-group>
      <div>
        <el-table
          :data="table.data"
          border
          style="width: 100%"
          :header-cell-style="{background:'#E4E7ED',color:'#303133'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55"/>
          <el-table-column prop="username" align="center" label="登录账号"/>
          <el-table-column prop="nickname" align="center" label="用户名"/>
          <el-table-column prop="phone" align="center" label="手机号"/>
          <el-table-column align="center" label="状态" width="120">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state === 0" size="medium">正常</el-tag>
              <el-tag v-if="scope.row.state === 1" size="medium">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间" width="180"/>
          <el-table-column label="操作" width="140" align="center">
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
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.data.nickname" placeholder="请输入昵称" @input="handleNicknameBlur"/>
        </el-form-item>
        <el-form-item v-show="form.showUsername" label="用户名" prop="username">
          <el-input v-model="form.data.username" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item v-show="form.showPassword" label="密码" prop="password">
          <el-input v-model="form.data.password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.data.phone" placeholder="请输入手机号"/>
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
import { apiDelete, apiPage, apiResetPassword, apiSave, apiUpdate } from '@/api/system/user'

const pinyin = require('js-pinyin')
export default {
  data() {
    return {
      table: {
        data: [],
        total: 0,
        selection: []
      },
      queryForm: {
        current: 1,
        size: 10,
        nickname: undefined,
        username: undefined
      },
      form: {
        data: {
          nickname: undefined,
          username: undefined,
          password: undefined,
          phone: undefined
        },
        dialog: false,
        showPassword: true,
        showUsername: true,
        title: '弹窗',
        button: '保存',
        rules: {
          nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
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
        nickname: undefined,
        username: undefined,
        password: undefined,
        phone: undefined
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.form.dialog = true
      this.form.title = '添加用户'
      this.form.button = '保存'
    },
    handleEdit(row) {
      this.form.data = row
      this.form.data.password = undefined
      this.form.dialog = true
      this.form.title = '修改用户'
      this.form.button = '修改'
      this.form.showUsername = false
      this.form.showPassword = false
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
          const tmpIds = this.table.selection.map(tmp => tmp.id).join(',')
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
    },
    handleResetPassword() {
      if (this.table.selection.length && this.table.selection.length >= 1) {
        this.$confirm('此操作将重置密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const tmpIds = this.table.selection.map(tmp => tmp.id).join(',')
          apiResetPassword(tmpIds).then(res => {
            const { message } = res
            this.$message.success(message)
          })
        }).catch(() => {
          this.$message.error('已取消重置')
        })
      } else {
        this.$message.warning('至少选择一条数据')
      }
    },
    handleNicknameBlur(val) {
      this.form.data.username = pinyin.getFullChars(val)
    }
  }
}
</script>

<style scoped>

</style>
