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
        <el-table-column align="center" label="认证实体ID" width="130">
          <template slot-scope="scope">{{ scope.row.entity_pid }}</template>
        </el-table-column>
        <el-table-column align="center" label="所属软件名" width="130">
          <template slot-scope="scope">{{ scope.row.software_name }}</template>
        </el-table-column>
        <el-table-column align="center" label="所属用户ID" width="130">
          <template slot-scope="scope">{{ scope.row.user_id }}</template>
        </el-table-column>
        <el-table-column align="center" label="所属节点ID" width="95">
          <template slot-scope="scope">{{ scope.row.node_id }}</template>
        </el-table-column>
        <el-table-column align="center" label="部署IP" width="130">
          <template slot-scope="scope">{{ scope.row.entity_ip }}</template>
        </el-table-column>
        <el-table-column align="center" label="部分私钥" width="95">
          <template slot-scope="scope">
            <el-tooltip class="description-tooltip" effect="dark" :content="scope.row.entity_parcialkey" :popper-options="{ boundariesElement: 'window' }" placement="top-start" :open-delay="500">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-document-copy"
                @click="copyEntityParcialkey(scope.row.entity_pid, scope.row.entity_parcialkey)"
              >复制</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="活跃状态" width="95" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.is_alive | statusFilter">{{ scope.row.is_alive ? "运行中" : "未运行" }}</el-tag>
          </template>
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
          width="150"
        >
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-key" circle @click="handleEntityCalculateParticalkey(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
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
import { entityQuery, entityWithdraw, entityCalculateParticalkey, entityQueryAlive } from '@/api/entity'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        'true': 'success',
        'false': 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      layout: 'total, prev, pager, next, sizes, jumper',
      timer: null,
      timerInterval: 60000 // 轮询间隔：60s
    }
  },
  created() {
    this.getData();
    this.timer = setInterval(this.updateIsAlive, this.timerInterval);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    copyEntityParcialkey(entityPid, entityParcialkey) {
      if (!entityParcialkey) {
        this.$message.error('部分私钥为空，请检查是否已为该认证实体下发密钥！')
        return
      }
      navigator.clipboard.writeText(entityParcialkey)
        .then(() => {
          this.$message.success(`已复制${entityPid}的部分私钥！`)
        })
        .catch(() => {
          this.$message.error('复制失败，请手动复制文本！')
        })
    },
    handleDelete(row) {
      this.$confirm('确定要撤销该认证实体吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          entityWithdraw(row.entity_pid)
            .then(response => {
              if (response.status === 'success') {
                this.getData()
                this.$message.success('撤销认证实体成功！')
              } else {
                this.$message.error('认证服务器处理出错，撤销认证实体失败！')
              }
            })
            .catch(() => {
              this.$message.error('撤销认证实体失败，请稍后再试！')
            })
        })
        .catch(() => { })
    },
    handleEntityCalculateParticalkey(row) {
      this.$confirm('确定要为该认证实体下发密钥吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          entityCalculateParticalkey(row.entity_pid)
            .then(response => {
              if (response.status === 'success') {
                this.getData()
                this.$message.success('密钥下发成功，开始计算部分私钥！')
              } else {
                this.$message.error('认证服务器处理出错，密钥下发失败！')
              }
            })
            .catch(() => {
              this.$message.error('密钥下发失败，请稍后再试！')
            })
        })
        .catch(() => { })
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
      entityQuery(params).then((response) => {
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
        this.$message.error(err)
      })
    },
    async updateIsAlive() {
      this.listLoading = true
      try {
        const params = {
          page: this.currentPage,
          limit: this.pageSize
        }
        await entityQueryAlive(params).then((response) => {
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
          this.$message.error(err)
        })
      } catch (err) {
        this.$message.error(err);
      }
    }
  },
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
