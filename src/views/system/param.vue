<template>
  <BaseContainer>
    <el-row style="padding-bottom: 20px">
      <el-form ref="queryForm" :model="queryForm" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="参数名称" prop="paramName">
              <el-input
                v-model="queryForm.paramName"
                placeholder="请输入参数名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="参数键" prop="paramKey">
              <el-input
                v-model="queryForm.paramKey"
                placeholder="请输入参数键"
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
        <el-button type="danger" icon="el-icon-minus" @click="handleBatchDelete">删除</el-button>
      </el-button-group>
      <div>
        <el-table
          :data="table.data"
          border
          :header-cell-style="{background:'#E4E7ED',color:'#303133'}"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55"/>
          <el-table-column prop="paramName" align="center" label="参数名称"></el-table-column>
          <el-table-column prop="paramKey" align="center" label="参数键"></el-table-column>
          <el-table-column prop="paramValue" align="center" label="参数值"></el-table-column>
          <el-table-column prop="sort" align="center" label="排序"></el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间" width="280"></el-table-column>
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
        <el-form-item label="参数名称" prop="paramName">
          <el-input v-model="form.data.paramName" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item label="参数键" prop="paramKey">
          <el-input v-model="form.data.paramKey" placeholder="请输入参数键"></el-input>
        </el-form-item>
        <el-form-item label="参数值" prop="paramValue">
          <el-input v-model="form.data.paramValue" placeholder="请输入参数值"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.data.sort" placeholder="请输入排序"></el-input>
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
import { apiPage, apiDelete, apiSave, apiUpdate } from '@/api/system/param'

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
        paramName: undefined,
        paramKey: undefined
      },
      // 表单
      form: {
        data: {
          paramName: undefined,
          paramCode: undefined,
          paramValue: undefined,
          sort: undefined
        },
        dialog: false,
        title: '弹窗',
        button: '保存',
        rules: {
          paramName: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
          paramKey: [{ required: true, message: '请输入参数键', trigger: 'blur' }],
          paramValue: [{ required: true, message: '请输入参数值', trigger: 'blur' }],
          sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
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
        paramName: undefined,
        paramCode: undefined,
        paramValue: undefined,
        sort: undefined
      }
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.form.dialog = true
      this.form.button = '保存'
      this.form.title = '添加参数'
    },
    handleEdit(row) {
      this.form.dialog = true
      this.form.title = '修改参数'
      this.form.button = '修改'
      this.form.data = row
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
        this.$message.warning('取消删除')
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
          this.$message.warning('已取消删除')
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
