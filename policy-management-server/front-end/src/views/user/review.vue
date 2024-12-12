<template>
  <div>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" prop="id" width="50" label="序号" />
        <el-table-column align="center" label="用户ID" width="130">
          <template slot-scope="scope">{{ scope.row.user_id }}</template>
        </el-table-column>
        <el-table-column label="用户名" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户角色" width="130" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_row }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户邮箱">
          <template slot-scope="scope">{{ scope.row.user_email }}</template>
        </el-table-column>
        <el-table-column align="center" label="用户手机号">
          <template slot-scope="scope">{{ scope.row.user_phone }}</template>
        </el-table-column>
        <el-table-column align="center" prop="created_time" label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="update_time" label="更新时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.update_time }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-check" circle @click="handleApprove(scope.row)" />
            <el-button type="danger" icon="el-icon-close" circle @click="handleDisapprove(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 30, 50]"
          :page-size="pageSize"
          :layout="layout"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { AppliedUserQuery, userApplyReview } from '@/api/user'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      layout: 'total, prev, pager, next, sizes, jumper'
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleApprove(row) {
      userApplyReview(row.user_id, true)
        .then(response => {
          if (response.status === 'success') {
            this.getData()
            this.$message.success(`用户${row.user_name}的审批通过！`)
          } else {
            this.$message.error('认证服务器处理出错，用户审批失败！')
          }
        })
        .catch(() => {
          this.$message.error('用户审批失败，请稍后再试！')
        })
    },
    handleDisapprove(row) {
      userApplyReview(row.user_id, false)
        .then(response => {
          if (response.status === 'success') {
            this.getData()
            this.$message.success(`用户${row.user_name}的审批不通过！`)
          } else {
            this.$message.error('认证服务器处理出错，用户审批失败！')
          }
        })
        .catch(() => {
          this.$message.error('用户审批失败，请稍后再试！')
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    getData() {
      this.listLoading = true
      const params = {
        page: this.currentPage,
        limit: this.pageSize
      }
      AppliedUserQuery(params).then((response) => {
        this.list = response.message.data
        this.total = response.message.num

        const startId = (this.currentPage - 1) * this.pageSize + 1
        this.list = this.list.map((item, index) => {
          return {
            id: startId + index,
            ...item
          }
        })

        this.listLoading = false
      }).catch((err) => {
        console.error(err)
      })
    }
  }
}
</script>

  <style lang="scss" scoped>
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1%;
  }
  </style>
