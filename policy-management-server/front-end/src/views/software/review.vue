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
        <el-table-column align="center" label="软件ID" width="130">
          <template slot-scope="scope">{{ scope.row.rsoftware_id }}</template>
        </el-table-column>
        <el-table-column align="center" label="软件版本" width="80">
          <template slot-scope="scope">V{{ scope.row.rsoftware_version }}</template>
        </el-table-column>
        <el-table-column align="center" label="发布用户ID" width="130">
          <template slot-scope="scope">{{ scope.row.user_id }}</template>
        </el-table-column>
        <el-table-column label="软件名" width="160" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.rsoftware_name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="部署路径" width="130">
          <template slot-scope="scope">{{ scope.row.rsoftware_path }}</template>
        </el-table-column>
        <el-table-column align="center" label="软件描述" width="95">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="small"
              icon="el-icon-info"
              @click="openDialog(scope.row.rsoftware_name, scope.row.rsoftware_desc)"
            >详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_time" label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <!-- 
        <el-table-column align="center" prop="update_time" label="更新时间">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.update_time }}</span>
          </template>
        </el-table-column>
        -->
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

      <el-dialog
        :title="`${dialogSoftwareName}的详细信息`"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleDialogClose"
      >
        <span class="dialog-content">{{ dialogSoftwareDesc }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>

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
import { RegisteredSoftwareQuery, softwareRegistrationReview } from '@/api/software'

export default {
  data() {
    return {
      dialogSoftwareName: '',
      dialogSoftwareDesc: '',
      dialogVisible: false,
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
    openDialog(softwareName, softwareDesc) {
      this.dialogSoftwareName = softwareName
      this.dialogSoftwareDesc = softwareDesc
      this.dialogVisible = true
    },
    handleDialogClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleApprove(row) {
      softwareRegistrationReview(row.rsoftware_id, true)
        .then(response => {
          if (response.status === 'success') {
            this.getData()
            this.$message.success(`已通过软件${row.rsoftware_name}的审批！`)
            // 后端计算软件哈希并存入数据库SoftwareTable
          } else {
            this.$message.error('认证服务器处理出错，操作失败！')
          }
        })
        .catch(() => {
          this.$message.error('操作失败，请检查部署路径或稍后再试！')
        })
    },
    handleDisapprove(row) {
      softwareRegistrationReview(row.rsoftware_id, false)
        .then(response => {
          if (response.status === 'success') {
            this.getData()
            this.$message.success(`已拒绝软件${row.rsoftware_name}的审批！`)
          } else {
            this.$message.error('认证服务器处理出错，操作失败！')
          }
        })
        .catch(() => {
          this.$message.error('操作失败，请检查部署路径或稍后再试！')
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
      RegisteredSoftwareQuery(params).then((response) => {
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

  .description-tooltip {
    white-space: normal; /* 提示框内允许换行 */
  }

  .dialog-content {
    line-height: 1.5;
  }
  </style>
