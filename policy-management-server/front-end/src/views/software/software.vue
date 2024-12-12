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
          <template slot-scope="scope">{{ scope.row.software_id }}</template>
        </el-table-column>
        <el-table-column align="center" label="软件版本" width="80">
          <template slot-scope="scope">{{ scope.row.software_version }}</template>
        </el-table-column>
        <el-table-column align="center" label="发布用户ID" width="130">
          <template slot-scope="scope">{{ scope.row.user_id }}</template>
        </el-table-column>
        <el-table-column label="软件名" width="160" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.software_name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="软件哈希" width="95">
          <template slot-scope="scope">
            <el-tooltip class="description-tooltip" effect="dark" :content="scope.row.software_hash" :popper-options="{ boundariesElement: 'window' }" placement="top-start" :open-delay="500">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-document-copy"
                @click="copySoftwareHash(scope.row.software_name, scope.row.software_hash)"
              >复制</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="软件描述" width="95">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="small"
              icon="el-icon-info"
              @click="openDialog(scope.row.software_name, scope.row.software_desc)"
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
            <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
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

      <el-drawer
        class="info-drawer"
        :title="drawerTitle"
        :before-close="handleDrawerClose"
        :visible.sync="drawerVisible"
        direction="ltr"
        custom-class="info-drawer"
      >
        <div class="info-drawer__content">
          <el-form :model="editedSoftware" label-position="left">
            <el-form-item label="软件ID" :label-width="formLabelWidth" required>
              <el-input v-model="editedSoftware.software_id" readonly disabled />
            </el-form-item>
            <el-form-item label="软件版本" :label-width="formLabelWidth" required>
              <el-input v-model="editedSoftware.software_version" />
            </el-form-item>
            <el-form-item label="发布用户ID" :label-width="formLabelWidth" required>
              <el-input v-model="editedSoftware.user_id" readonly disabled />
            </el-form-item>
            <el-form-item label="软件名" :label-width="formLabelWidth" required>
              <el-input v-model="editedSoftware.software_name" />
            </el-form-item>
            <el-form-item label="软件哈希" :label-width="formLabelWidth" required>
              <el-input v-model="editedSoftware.software_hash" readonly disabled />
            </el-form-item>
            <el-form-item label="软件描述" :label-width="formLabelWidth">
              <el-input v-model="editedSoftware.software_desc" type="textarea" :autosize="{ minRows: 10, maxRows: 50}" :maxlength="softwareDescMaxLength" show-word-limit />
            </el-form-item>
          </el-form>
          <div class="info-drawer__footer">
            <el-button @click="handleDrawerClose">取 消</el-button>
            <el-button
              type="primary"
              :loading="drawerLoading"
              @click="handleDrawerSubmit"
            >
              {{ drawerLoading ? '提交中 ...' : '提 交' }}
            </el-button>
          </div>
        </div>
      </el-drawer>

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
import { softwareQuery, softwareUpdate, softwarDelete } from '@/api/software'

export default {
  data() {
    return {
      dialogSoftwareName: '',
      dialogSoftwareDesc: '',
      dialogVisible: false,
      formLabelWidth: '100px',
      softwareDescMaxLength: 2000,
      drawerLoading: false,
      drawerVisible: false,
      drawerTitle: '',
      editedSoftware: {},
      list: null,
      listLoading: true,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      layout: 'total, prev, pager, next, sizes, jumper'
    }
  },
  watch: {
    editedSoftware: {
      handler(initialSoftware) {
        if (!this.drawerTitle) {
          this.drawerTitle = `您正在编辑软件 ${initialSoftware.software_name} 的详细信息...`
        }
      },
      deep: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    copySoftwareHash(softwareName, softwareHash) {
      navigator.clipboard.writeText(softwareHash)
        .then(() => {
          this.$message.success(`已复制${softwareName}的哈希！`)
        })
        .catch(() => {
          this.$message.error('复制失败，请手动复制文本！')
        })
    },
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
    handleEdit(row) {
      // eslint-disable-next-line no-unused-vars
      const { id, create_time, update_time, ...restFields } = row
      this.editedSoftware = { ...restFields }
      this.drawerVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定要删除该软件吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          softwarDelete(row.software_id)
            .then(response => {
              if (response.status === 'success') {
                this.getData()
                this.$message.success('删除软件成功！')
              } else {
                this.$message.error('认证服务器处理出错，删除软件失败！')
              }
            })
            .catch(() => {
              this.$message.error('删除软件失败，请稍后再试！')
            })
        })
        .catch(() => { })
    },
    drawerReset() {
      this.drawerLoading = false
      this.drawerTitle = ''
      clearTimeout(this.drawerTimer)
      this.drawerVisible = false
    },
    handleDrawerClose(done) {
      this.$confirm('', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message:
        `<div style="white-space: pre-wrap">确认关闭表单吗？<br><span style="color: red;">注意：</span>此操作将放弃当前所有更改！</div>`,
        dangerouslyUseHTMLString: true
      })
        .then(_ => {
          this.drawerReset()
          done()
        })
        .catch(_ => {})
    },
    handleDrawerSubmit() {
      if (this.drawerLoading) {
        return
      }
      this.$confirm('确定要提交表单吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.drawerLoading = true
          this.drawerTimer = setTimeout(() => {
            // eslint-disable-next-line no-unused-vars
            const { user_id, software_hash, ...updateForm } = this.editedSoftware
            // const { software_id, user_id, software_hash, ...updateForm } = this.editedSoftware
            softwareUpdate(updateForm)
              .then(response => {
                if (response.status === 'success') {
                  this.getData()
                  this.$message.success('更新软件信息成功！')
                } else {
                  this.$message.error('认证服务器处理出错，更新软件信息失败！')
                }

                setTimeout(() => {
                  this.drawerReset()
                }, 200)
              })
              .catch(() => {
                this.$message.error('更新软件信息失败，请稍后再试！')
                this.drawerReset()
              })
          }, 1000)
        })
        .catch(() => {})
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
      softwareQuery(params).then((response) => {
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

.info-drawer__content {
  padding: 20px;
  height: 90%;
  overflow-y: auto;
}

.info-drawer__footer {
  padding: 20px;
  display: flex;
  justify-content: space-between, flex-end;
}

.info-drawer__footer .el-button:first-child {
  margin-left: auto;
  margin-right: 2%;
}
</style>
